import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../auth/services/authService';
import ReportList, { type Report } from '../../../components/ui/ReportList';
import { MapPin, Eye } from 'lucide-react';

const LocalReports: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. Get user coordinates using a query 
  const { data: coords, error: geoError, isLoading: isGeoLoading } = useQuery({
    queryKey: ['user-coordinates'],
    queryFn: () =>
      new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser.'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }),
    staleTime: 1000 * 60 * 15, // Cache user location for 15 minutes
    gcTime: 1000 * 60 * 30,
    retry: false,
  });

  // 2. Query local issues using the exact filtering logic from your recent reports component
  const { data: localReports = [], isLoading: isReportsLoading, error: fetchError } = useQuery<Report[], Error, Report[]>({
    queryKey: ['local-reports', coords?.latitude, coords?.longitude],
    queryFn: async () => {
      const response = await publicApi.get('/issues/');
      return Array.isArray(response.data) ? response.data : (response.data.results ?? []);
    },
    enabled: !!coords?.latitude && !!coords?.longitude, // Only fetch when we have coordinates
    staleTime: 1000 * 60 * 5, // Keep local cached data fresh for 5 minutes
    gcTime: 1000 * 60 * 10,
    select: (data: Report[]) => {
      const activeReports = data.filter((report: Report) => report.status?.toLowerCase() !== 'rejected');
      
      const globallySorted = [...activeReports].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Apply the exact proximity targeting step from your snippet
      if (coords?.latitude && coords?.longitude) {
        return globallySorted.filter((report) => {
          // Report type may not have latitude/longitude typed; use a safe any-cast
          const rptLat = (report as any).latitude;
          const rptLon = (report as any).longitude;
          if (rptLat == null || rptLon == null) return false;
          const distance = Math.sqrt(
            Math.pow(rptLat - coords.latitude, 2) +
            Math.pow(rptLon - coords.longitude, 2)
          );
          return distance < 0.1; 
        });
      }

      return [];
    }
  });

  const loading = isGeoLoading || isReportsLoading;
  
  // Clean, unified error display message
  const displayError = useMemo(() => {
    if (geoError) {
      return 'Please enable location access in your browser to view reports near you.';
    }
    if (fetchError) {
      return 'Failed to load local reports. Please try again.';
    }
    return null;
  }, [geoError, fetchError]);

  return (
    <div className="flex flex-col h-full w-full p-3 md:p-12 min-h-screen bg-gray-50/30">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Header section matching AllReportsPage */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base md:text-xl font-semibold text-secondary flex items-center gap-2">
              <MapPin size={20} className="text-[#D4A373]" />
              {t('reportsPage.localTitle', 'Reports Near You')}
            </h2>
            <p className="text-[#4A3728]/70 text-xs md:text-sm">
              {t('reportsPage.localSubtitle', 'Showing issues reported around your current location')}
            </p>
          </div>
          <button
            onClick={() => navigate('/all-reports')}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-secondary/20 rounded-full text-xs font-bold text-white bg-secondary/90 hover:bg-secondary transition-colors self-start md:self-auto"
          >
            <Eye size={14} />
            View All Reports
          </button>
        </div>

        {/* Content handling */}
        {loading ? (
          // Skeleton loader matched to ReportList layout
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
            <div className="bg-white rounded-3xl border border-secondary/5 shadow-sm p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-200/50 animate-pulse rounded-full" />
              ))}
            </div>
          </div>
        ) : displayError ? (
          // Geolocation or network fetch issue state
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2.5rem] border border-secondary/5 shadow-sm p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <MapPin size={24} />
            </div>
            <p className="text-sm font-medium text-secondary/70 max-w-sm">
              {displayError}
            </p>
            <button
              onClick={() => navigate('/reports')}
              className="bg-secondary/90 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-secondary transition-all shadow-sm"
            >
              See All Reports
            </button>
          </div>
        ) : localReports.length === 0 ? (
          // No reports near user's location state
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2.5rem] border border-secondary/5 shadow-sm p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-secondary/40">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-secondary text-sm">
              No reports found around your location
            </h3>
            <p className="text-xs text-secondary/60 max-w-xs">
              There aren't any active issues reported nearby right now. Click below to explore issues everywhere else.
            </p>
            <button
              onClick={() => navigate('/reports')}
              className="bg-secondary/90 text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-secondary transition-all shadow-sm"
            >
              See All Reports
            </button>
          </div>
        ) : (
          // Render matching ReportList when reports exist
          <ReportList
            reports={localReports}
            loading={false}
            error={null}
            onRowClick={(report) => navigate(`/reports/${report.id}`)}
          />
        )}

      </div>
    </div>
  );
};

export default LocalReports;