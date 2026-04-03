import { useTranslation } from 'react-i18next';
import { type Report } from '../../report/components/IssueMapPicker';
import { ArrowRight, Clock, MapPin, ChevronRight } from 'lucide-react';

interface RecentReportsProps {
  reports: Report[];
}

const RecentReports = ({ reports }: RecentReportsProps) => {
  const { t } = useTranslation();
  const latestReports = reports.slice(0, 3);

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
          <button className="group flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-all">
            {t('recentReports.viewAll')}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col">
          {latestReports.map((report) => (
            <div key={report.id} className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-secondary/5 hover:bg-secondary/2 transition-all px-4 -mx-4 rounded-xl">
              <div className="flex items-center gap-4 mb-4 md:mb-0 md:w-48 shrink-0">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-secondary uppercase tracking-widest">
                    {t(report.status)}
                  </span>
                  <div className="flex items-center gap-1 text-secondary/40 text-[9px] font-bold">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{t('recentReports.timeAgo')}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 md:px-8">
                {/* FIX: Wrap the dynamic report title key in t() */}
                <h3 className="text-lg font-black text-secondary group-hover:text-secondary/90 transition-colors duration-300 font-header">
                  {t(report.title)}
                </h3>
                <div className="flex items-center gap-1.5 text-secondary/50 mt-1">
                  <MapPin className="w-3 h-3" />
                  <p className="text-[11px] font-medium tracking-tight">
                    {t('recentReports.near')} {report.location_lat.toFixed(3)}, {report.location_long.toFixed(3)}
                  </p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex items-center gap-4">
                <button className="text-[10px] font-black text-secondary/40 group-hover:text-secondary uppercase tracking-widest transition-all">
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