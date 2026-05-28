import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import Search from './Search';
import Table from './Table';

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
  searchTerm: string;
  selectedStatus: string;
  searchOptions: Array<{ id: string; label: string; value: string }>;
  onSearchTermChange: (value: string) => void;
  onStatusChange: (value: string) => void;
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
  searchTerm,
  selectedStatus,
  searchOptions,
  onSearchTermChange,
  onStatusChange,
  onRowClick,
}: ReportListProps) => {
  const { t } = useTranslation();
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const columns = [
    { header: t('reportsPage.tableHeaders.issueId'), key: 'issue_number' },
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
      header: t('reportsPage.tableHeaders.date'),
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
      <div className="flex flex-col md:flex-row gap-2 p-4">
        <div className="flex-1 min-w-[250px]">
          <Search
            label={t('navbar.searchPlaceholder')}
            placeholder={t('reportsPage.searchPlaceholder')}
            value={searchTerm}
            options={searchOptions}
            onChange={onSearchTermChange}
            onSelect={(option) => onSearchTermChange(option.value)}
            className="w-full"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm cursor-pointer outline-none"
        >
          <option value="">{t('reportsPage.allStatuses', 'All Statuses')}</option>
          <option value="submitted">{t('reports.status.submitted', 'Submitted')}</option>
          <option value="in_progress">{t('reports.status.in_progress', 'In Progress')}</option>
          <option value="resolved">{t('reports.status.resolved', 'Resolved')}</option>
          <option value="rejected">{t('reports.status.rejected', 'Rejected')}</option>
          <option value="pending_admin">{t('reports.status.pending_admin', 'Pending Admin')}</option>
          <option value="escalated">{t('reports.status.escalated', 'Escalated')}</option>
        </select>

        <button className="flex items-center justify-center gap-1 px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs w-full md:w-auto transition-colors hover:bg-neutral-50 active:bg-neutral-100">
          {t('reportsPage.filterButton')} <Filter size={14} />
        </button>
      </div>

      <div ref={tableContainerRef} className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-sm text-gray-500 font-medium">{t('reportsPage.loading')}</div>
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
