import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import { publicApi } from '../../auth/services/authService';
import { useQuery } from '@tanstack/react-query';
import type { Nullable } from 'vitest';

const createLocationIcon = (color: string, isUser: boolean = false) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center">
        ${isUser ? '<div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>' : ''}
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="drop-shadow-md">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-9-7-9z" fill="${color}"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      </div>`,
    className: 'custom-location-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const STATUS_COLORS: Record<string, string> = {
  submitted: '#ef4444',
  under_review: '#f59e0b',
  in_progress: '#3b82f6',
  resolved: '#22c55e',
  rejected: '#94a3b8',
};

export interface Report {
  id: string;
  location_lat: number;
  location_long: number;
  title: string;
  status: string;
  created_at: string;
}

interface MapProps {
  reports?: Report[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

const MapEvents = ({
  onLocationSelect
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
};

// Smoothly re-centers map view whenever selectedLocation changes
const MapRecenter = ({ location }: { location?: { lat: number; lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [location, map]);

  return null;
};

const IssueMapPicker: React.FC<MapProps> = ({
  reports = [],
  onLocationSelect,
  selectedLocation
}) => {
  const { t } = useTranslation();
  const defaultCenter: [number, number] = [9.0192, 38.7525];

  // TanStack Query with LocalStorage fallback to survive browser refresh
  const { data: backendReports = [], isLoading: loading } = useQuery<Report[]>({
    queryKey: ['mapReportsTimeline'],
    queryFn: async () => {
      try {
        const response = await publicApi.get('/issues/');
        const rawReports = Array.isArray(response.data)
          ? response.data
          : response.data?.results ?? [];

        const normalized = rawReports
          .filter((item: any) =>
            Number.isFinite(Number(item?.location_lat)) &&
            Number.isFinite(Number(item?.location_long))
          )
          .map((item: any) => ({
            ...item,
            location_lat: Number(item.location_lat),
            location_long: Number(item.location_long),
          })) as Report[];

        // Sync local cache storage
        localStorage.setItem('cached_map_reports', JSON.stringify(normalized));
        return normalized;
      } catch (error) {
        console.error('Failed to load issue reports for map network fetch:', error);
        const diskCache = localStorage.getItem('cached_map_reports');
        if (diskCache) {
          return JSON.parse(diskCache);
        }
        throw error;
      }
    },
    // Populate cache on load directly from disk if available
    initialData: () => {
      const saved = localStorage.getItem('cached_map_reports');
      return saved ? JSON.parse(saved) : undefined;
    },
    staleTime: 1000 * 60 * 10, // Consider fresh for 10 minutes
    gcTime: 1000 * 60 * 30,    // Retain cache in memory for 30 minutes
  });

  const mapReports = useMemo(() => {
    if (Array.isArray(reports) && reports.length > 0) {
      return reports;
    }
    return backendReports;
  }, [backendReports, reports]);

  const fallbackCenter = useMemo(() => {
    const firstReport = mapReports.find(
      (report) =>
        Number.isFinite(report.location_lat) &&
        Number.isFinite(report.location_long)
    );

    return firstReport
      ? ([firstReport.location_lat, firstReport.location_long] as [number, number])
      : defaultCenter;
  }, [defaultCenter, mapReports]);

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : fallbackCenter;

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-secondary/10 shadow-lg relative group">
      <MapContainer
        center={mapCenter}
        zoom={selectedLocation ? 15 : 13}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          url={
            import.meta.env.VITE_MAP_TILE_URL ||
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapEvents onLocationSelect={onLocationSelect} />
        <MapRecenter location={selectedLocation ?? null} />

        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createLocationIcon('#3b82f6', true)}
          >
            <Tooltip
              direction="top"
              offset={[0, -30]}
              opacity={1}
              permanent
            >
              <div className="p-1">
                <span className="text-[10px] uppercase font-black text-secondary">
                  {t('map.selectedLocation')}
                </span>
              </div>
            </Tooltip>
          </Marker>
        )}

        {mapReports.map((report) => {
          const normalizedStatus = report.status
            ?.toLowerCase()
            .replace(/\s+/g, '_');

          return (
            <Marker
              key={report.id}
              position={[report.location_lat, report.location_long]}
              icon={createLocationIcon(
                STATUS_COLORS[normalizedStatus] || '#000'
              )}
            >
              <Popup>
                <div className="p-1 min-w-30">
                  <h4 className="font-header font-bold text-secondary text-sm leading-tight">
                    {report.title}
                  </h4>

                  <div className="mt-2 flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: STATUS_COLORS[normalizedStatus]
                      }}
                    />

                    <span className="text-[10px] uppercase font-black tracking-wider text-secondary/60">
                      {t(`reports.status.${normalizedStatus}`)}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-widest shadow-xl">
          Loading issues…
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-widest shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {t('map.liveStatus')}
        </div>
      </div>
    </div>
  );
};

export default IssueMapPicker;