import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Table from './Table';
import ThemeLoader from './ThemeLoader';

export interface Report {
  id: string;
  issue_number: string;
  category_name: string;
  subcategory_name?: string;
  location_address: string;
  status: string;
  status_display?: string;
  created_at: string;
}

interface ReportListProps {
  reports: Report[];
  loading: boolean;
  error: string | null;
  searchTerm?: string;
  selectedStatus?: string;
  searchOptions?: Array<{ id: string; label: string; value: string }>;
  onSearchTermChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onRowClick: (report: Report) => void;
}

const statusColor = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === 'in progress' || normalized === 'in_progress') return 'bg-amber-100 text-amber-700';
  if (normalized === 'resolved') return 'bg-emerald-100 text-emerald-700';
  if (normalized === 'submitted') return 'bg-slate-100 text-slate-700';
  if (normalized === 'rejected') return 'bg-rose-100 text-rose-700';
  if (normalized === 'pending_admin' || normalized === 'pending admin') return 'bg-violet-100 text-violet-700';
  if (normalized === 'escalated') return 'bg-sky-100 text-sky-700';
  return 'bg-slate-100 text-slate-700';
};

const ReportList = ({
  reports,
  loading,
  error,
  onRowClick,
}: ReportListProps) => {
  const { t } = useTranslation();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const columns = [
    { header: t('reportsPage.tableHeaders.category'), key: 'category_name' },
    { header: t('reportsPage.tableHeaders.location'), key: 'location_address' },
    {
      header: t('reportsPage.tableHeaders.status'),
      key: 'status',
      render: (report: Report) => {
        const normalizedStatus = report.status?.toLowerCase() || '';
        const translatedStatus =
          t(`reports.status.${normalizedStatus}`, { defaultValue: report.status_display || report.status });

        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor(report.status)}`}>
            {translatedStatus}
          </span>
        );
      },
    },
    {
      header: 'Issue Created Day',
      key: 'created_at',
      render: (report: Report) =>
        report.created_at ? new Date(report.created_at).toLocaleDateString() : '',
    },
  ];

  const handleTableScroll = (direction: 'left' | 'right') => {
    if (!tableContainerRef.current) return;
    const scrollAmount = direction === 'right' ? 240 : -240;
    tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border border-[#4A3728]/10 rounded-md overflow-hidden relative shadow-xs">

      <div ref={tableContainerRef} className="overflow-x-auto">
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center p-4">
            <ThemeLoader size="md" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500 font-medium">{error}</div>
        ) : reports.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 font-medium">{t('reportsPage.noReports')}</div>
        ) : (
          <Table columns={columns} data={reports} onRowClick={onRowClick} />
        )}
      </div>

      <button
        type="button"
        onClick={() => handleTableScroll('right')}
        className="md:hidden absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#4A3728]/20 bg-white text-[#4A3728] shadow-sm active:scale-95 transition-transform"
        aria-label={t('reportsPage.scrollRight') || 'Scroll table right'}
      >
        →
      </button>
    </div>
  );
};

export default ReportList;
