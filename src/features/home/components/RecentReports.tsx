import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../auth/services/authService';
import { ArrowRight, Clock, MapPin, ChevronRight } from 'lucide-react';
import ThemeLoader from '../../../components/ui/ThemeLoader';

interface Report {
  id: string;
  issue_number: string;
  category_name: string;
  location_address: string;
  status: string;
  status_display: string;
  created_at: string;
}

const RecentReports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicApi.get('/issues/');
        const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];
        const sortedReports = [...data].sort(
          (a: Report, b: Report) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setReports(sortedReports.slice(0, 3));
      } catch (error: any) {
        console.error('Error fetching recent reports:', error);
        setError(error?.response?.data?.detail || error?.message || 'Failed to load recent reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  const latestReports = reports;

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

        <div className="flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <ThemeLoader size="md" />
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-sm text-red-500">{error || t('recentReports.error')}</div>
          ) : latestReports.length === 0 ? (
            <div className="px-4 py-6 text-sm text-secondary/60">{t('recentReports.noReports')}</div>
          ) : latestReports.map((report) => (
            <div key={report.id} className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-secondary/5 hover:bg-secondary/2 transition-all px-4 -mx-4 rounded-xl">
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
          ))}
        </div>
        <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-secondary/10 to-transparent" />
      </div>
    </section>
  );
};

export default RecentReports;