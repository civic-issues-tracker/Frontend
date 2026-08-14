import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../auth/services/authService';
import { ArrowRight, Clock, MapPin, ChevronRight, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useGeoLocation } from '../../../hooks/useGeolocation';

interface Report {
  id: string;
  issue_number: string;
  category_name: string;
  location_address: string;
  status: string;
  status_display: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
}

interface RecentReportsQueryResult {
  reports: Report[];
  isFallback: boolean;
}

const RecentReports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { location, isLoading: isLocationLoading } = useGeoLocation();

  const { data, isLoading: isQueryLoading, error } = useQuery<RecentReportsQueryResult, Error>({
    queryKey: ['recentReports', location?.lat, location?.lng],
    queryFn: async () => {
      // 1. Try fetching nearby issues if geolocation coordinates are available
      if (location?.lat && location?.lng) {
        try {
          const nearbyRes = await publicApi.get('/issues/nearby/', {
            params: {
              lat: location.lat,
              lng: location.lng,
            },
          });
          const nearbyData = Array.isArray(nearbyRes.data)
            ? nearbyRes.data
            : nearbyRes.data.results ?? [];

          if (nearbyData.length > 0) {
            return {
              reports: nearbyData.slice(0, 3),
              isFallback: false,
            };
          }
        } catch {
          
        }
      }

      // 2. Fallback: Fetch general recent issues if nearby returns empty, fails, or location is absent
      const globalRes = await publicApi.get('/issues/');
      const globalData = Array.isArray(globalRes.data)
        ? globalRes.data
        : globalRes.data.results ?? [];

      const sortedGlobal = [...globalData].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        reports: sortedGlobal.slice(0, 3),
        isFallback: true,
      };
    },
    enabled: !isLocationLoading,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
  });

  const viewReportDetail = (reportId: string) => {
    if (!reportId) return;
    navigate(`/reports/${reportId}`);
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay > 0) {
      return diffDay === 1
        ? t('recentReports.dayAgo', { count: diffDay })
        : t('recentReports.daysAgo', { count: diffDay });
    }
    if (diffHour > 0) {
      return diffHour === 1
        ? t('recentReports.hourAgo', { count: diffHour })
        : t('recentReports.hoursAgo', { count: diffHour });
    }
    if (diffMin > 0) {
      return diffMin === 1
        ? t('recentReports.minuteAgo', { count: diffMin })
        : t('recentReports.minutesAgo', { count: diffMin });
    }
    return t('recentReports.justNow');
  };

  if (isQueryLoading || isLocationLoading || !data) {
    return (
      <section className="bg-primary/40 pt-16 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-20">
          <div className="flex justify-between items-end mb-12 border-b border-secondary/10 pb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-header font-black text-secondary uppercase tracking-tighter">
                {t('recentReports.title')}
              </h2>
              <p className="text-secondary/50 font-body text-xs mt-1 italic">
                {t('recentReports.subtitle')}
              </p>
            </div>
            <button className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.2em] opacity-40 cursor-not-allowed">
              {t('recentReports.viewAll')}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-secondary/5 px-4 -mx-4 rounded-xl animate-pulse">
                <div className="flex items-center gap-4 mb-4 md:mb-0 md:w-48 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-secondary/20" />
                  <div className="flex flex-col space-y-2">
                    <div className="h-3 w-20 bg-secondary/20 rounded" />
                    <div className="h-2 w-16 bg-secondary/10 rounded" />
                  </div>
                </div>
                <div className="flex-1 md:px-8 space-y-2">
                  <div className="h-5 w-3/4 bg-secondary/20 rounded" />
                  <div className="h-3 w-1/2 bg-secondary/10 rounded" />
                </div>
                <div className="mt-6 md:mt-0 flex items-center gap-4">
                  <div className="h-3 w-20 bg-secondary/10 rounded" />
                  <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/5" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-secondary/10 to-transparent" />
        </div>
      </section>
    );
  }

  const { reports: latestReports, isFallback } = data;

  return (
    <section className="bg-primary/40 pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-20">
        <div className="flex justify-between items-end mb-12 border-b border-secondary/10 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-header font-black text-secondary uppercase tracking-tighter">
              {t('recentReports.title')}
            </h2>
            <p className="text-secondary/50 font-body text-xs mt-1 italic">
              {t('recentReports.subtitle')}
            </p>
          </div>
          <button 
            onClick={() => navigate('/all-reports')}
            className="group flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-all"
          >
            {t('recentReports.viewAll')}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dynamic Fallback Alert Banner Box */}
        {isFallback && !error && (
          <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-secondary/5 border border-secondary/10 rounded-xl text-secondary/70 text-xs font-body font-medium tracking-wide">
            <Info className="w-4 h-4 text-secondary/60 shrink-0" />
            <span>{t('recentReports.noReportsAroundArea', 'No reports found around your location area. Showing global recent activity instead.')}</span>
          </div>
        )}

        <div className="flex flex-col">
          {error ? (
            <div className="px-4 py-6 text-sm text-red-500">
              {error.message || t('recentReports.error')}
            </div>
          ) : latestReports.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm font-body font-medium tracking-wide text-secondary/60 bg-secondary/5 border border-secondary/5 rounded-xl">
              {t('recentReports.noGlobalReports', 'No updates available on the network.')}
            </div>
          ) : (
            latestReports.map((report) => (
              <div 
                key={report.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-secondary/5 hover:bg-secondary/2 transition-all px-4 -mx-4 rounded-xl"
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0 md:w-48 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-secondary uppercase tracking-widest">
                      {report.status_display || report.status}
                    </span>
                    <div className="flex items-center gap-1 text-secondary/40 text-[9px] font-bold">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{timeAgo(report.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 md:px-8">
                  <h3 className="text-lg font-black text-secondary group-hover:text-secondary/90 transition-colors duration-300 font-header">
                    {report.category_name} - {report.issue_number}
                  </h3>
                  <div className="flex items-center gap-1.5 text-secondary/50 mt-1">
                    <MapPin className="w-3 h-3" />
                    <p className="text-[11px] font-medium tracking-tight">
                      {t('recentReports.near')} {report.location_address}
                    </p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => viewReportDetail(report.id)}
                    aria-label={t('recentReports.viewDetailsAria')}
                    className="text-[10px] font-black text-secondary/40 group-hover:text-secondary uppercase tracking-widest transition-all cursor-pointer"
                  >
                    {t('recentReports.viewDetails')}
                  </button>
                  <div className="w-10 h-10 rounded-full border border-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-secondary/10 to-transparent" />
      </div>
    </section>
  );
};

export default RecentReports;