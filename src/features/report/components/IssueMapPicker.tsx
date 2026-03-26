import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// 2. Map Status to Colors 
const STATUS_COLORS: Record<string, string> = {
  submitted: '#ef4444',    // Red
  under_review: '#f59e0b', // Orange
  in_progress: '#3b82f6',  // Blue
  resolved: '#22c55e',     // Green
  rejected: '#94a3b8',     // Gray
};

export interface Report {
  id: string;
  location_lat: number;
  location_long: number;
  title: string;
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
}

interface MapProps {
  reports: Report[];
}

const IssueMapPicker: React.FC<MapProps> = ({ reports }) => {
  const savedCoords = localStorage.getItem("coords");
  const userLocation = savedCoords ? JSON.parse(savedCoords) : null;

  const defaultCenter: [number, number] = [9.0192, 38.7525];
  
  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  return (
    <div className="h-full w-full rounded-3xl overflow-hidden border border-secondary/10 shadow-lg relative group">
      <MapContainer 
        center={mapCenter} 
        zoom={userLocation ? 15 : 13} 
        className="h-full w-full z-0 "
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={createLocationIcon('#3b82f6', true)}
          >
            <Tooltip direction="top" offset={[0, -30]} opacity={1} sticky={true}>
              <div className="p-1 min-w-30">
                <h4 className="font-header font-bold text-secondary text-sm leading-tight">
                  {reports[0].title}
                </h4>
                <span className="text-[10px] uppercase font-black text-red-500">
                  Report near you
                </span>
              </div>
            </Tooltip>
          </Marker>
        )}

        {reports
            .filter(report => report.status === 'submitted')
            .map((report) => (
          <Marker 
            key={report.id}
            position={[report.location_lat, report.location_long]} 
            icon={createLocationIcon(STATUS_COLORS[report.status] || '#000')}
          >
            <Popup>
              <div className="p-1 min-w-30">
                <h4 className="font-header font-bold text-secondary text-sm leading-tight">
                  {report.title}
                </h4>
                <div className="mt-2 flex items-center gap-1.5">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: STATUS_COLORS[report.status] }}
                  />
                  <span className="text-[10px] uppercase font-black tracking-wider text-secondary/60">
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-secondary/10 text-[10px] font-bold text-secondary uppercase tracking-widest shadow-sm">
        Live Map: Addis Ababa
      </div>
    </div>
  );
};

export default IssueMapPicker;