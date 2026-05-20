import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { Search, Filter } from 'lucide-react';
import { privateApi } from '../../auth/services/authService';

interface Report {
  id: string;
  issue_number: string;
  category_name: string;
  location_address: string;
  status: string;
  status_display: string;
  created_at: string;
}

const statusColor = (status: string) => {
  if (status === 'In Progress') return 'text-yellow-600';
  if (status === 'Resolved') return 'text-green-700';
  if (status === 'Submitted') return 'text-[#4A3728]';
  if (status === 'Rejected') return 'text-red-600';
  return 'text-[#4A3728]';
};

const MyReportsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollTableRight = () => {
    if (!tableContainerRef.current) return;
    tableContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all issues from the database
        const res = await privateApi.get('/issues/?mine=true');
        // Handle both flat array and paginated response formats
        const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        setReports(data);
      } catch (error: any) {
        console.error('Error fetching reports:', error);
        setError(error?.response?.data?.detail || t('reportsPage.errorFallback'));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [t]);

  return (
    <CitizenDashboardLayout>
      <div className="flex flex-col h-full w-full p-3 md:p-12">

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex items-center w-full border border-[#4A3728]/30 rounded-full px-3 py-1 bg-white">
            <input
              type="text"
              placeholder={t('reportsPage.searchPlaceholder')}
              className="flex-1 bg-transparent outline-none text-xs md:text-sm text-[#4A3728]"
            />
            <Search size={14} className="text-[#4A3728]" />
          </div>

          <button className="flex items-center justify-center gap-1 px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs w-full md:w-auto">
            {t('reportsPage.filterButton')} <Filter size={14} />
          </button>
        </div>

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-base md:text-xl font-semibold text-[#4A3728]">
            {t('reportsPage.pageTitle')}
          </h2>
          <p className="text-[#4A3728]/70 text-xs md:text-sm">
            {t('reportsPage.pageSubtitle')}
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#4A3728]/10 rounded-md overflow-hidden relative">
          <div ref={tableContainerRef} className="overflow-x-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">{t('reportsPage.loading')}</div>
            ) : error ? (
              <div className="p-4 text-sm text-red-500">{error}</div>
            ) : reports.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">{t('reportsPage.noReports')}</div>
            ) : (
              <table className="w-full text-left text-[10px] md:text-sm">
                <thead>
                  <tr className="text-[#4A3728] font-semibold border-b border-[#4A3728]/20">
                    <th className="py-2 px-1">{t('reportsPage.tableHeaders.issueId')}</th>
                    <th className="py-2 px-1">{t('reportsPage.tableHeaders.category')}</th>
                    <th className="py-2 px-1">{t('reportsPage.tableHeaders.location')}</th>
                    <th className="py-2 px-1">{t('reportsPage.tableHeaders.status')}</th>
                    <th className="py-2 px-1">{t('reportsPage.tableHeaders.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-[#4A3728]/10 cursor-pointer hover:bg-[#F8F5F2]"
                      onClick={() => navigate(`/reports/${report.id}`)}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(`/reports/${report.id}`)}
                      tabIndex={0}
                    >
                      <td className="py-2 px-1 text-[#4A3728] whitespace-nowrap">
                        {report.issue_number}
                      </td>
                      <td className="py-2 px-1 text-[#4A3728] whitespace-nowrap">
                        {report.category_name}
                      </td>
                      <td className="py-2 px-1 text-[#4A3728] whitespace-nowrap">
                        {report.location_address}
                      </td>
                      <td className={`py-2 px-1 font-medium whitespace-nowrap ${statusColor(report.status)}`}>
                        {report.status_display || report.status}
                      </td>
                      <td className="py-2 px-1 text-[#4A3728] whitespace-nowrap">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <button
            type="button"
            onClick={scrollTableRight}
            className="md:hidden absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#4A3728]/20 bg-white text-[#4A3728] shadow-sm"
            aria-label={t('reportsPage.scrollRight')}
          >
            →
          </button>
        </div>
      </div>
    </CitizenDashboardLayout>
  );
};

export default MyReportsPage;