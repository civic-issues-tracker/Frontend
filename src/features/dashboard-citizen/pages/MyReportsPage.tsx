import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { Filter } from 'lucide-react';
import Search from '../../../components/ui/Search';
import { privateApi } from '../../auth/services/authService';
import Table from '../../../components/ui/Table';

interface Report {
  id: string;
  issue_number: string;
  category_name: string;
  subcategory_name?: string;
  location_address: string;
  status: string;
  status_display: string;
  created_at: string;
}

const statusColor = (status: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === 'in progress' || normalized === 'in_progress') return 'text-yellow-600';
  if (normalized === 'resolved') return 'text-green-700';
  if (normalized === 'submitted') return 'text-[#4A3728]';
  if (normalized === 'rejected') return 'text-red-600';
  return 'text-[#4A3728]';
};

const MyReportsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const searchOptions = useMemo(
    () => [
      ...categories.map((category) => ({ id: `category-${category}`, label: category, value: category })),
      ...subcategories.map((subcategory) => ({ id: `subcategory-${subcategory}`, label: subcategory, value: subcategory })),
      ...locations.map((location) => ({ id: `location-${location}`, label: location, value: location })),
    ],
    [categories, subcategories, locations]
  );

  const scrollTableRight = () => {
    if (!tableContainerRef.current) return;
    tableContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
  };

  // Memoized Search & Status filter grid parameters
  const filteredReports = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return reports.filter(report => {
      const matchesSearch = searchTerm === '' ||
        report.issue_number?.toLowerCase().includes(normalizedSearch) ||
        report.category_name?.toLowerCase().includes(normalizedSearch) ||
        report.subcategory_name?.toLowerCase().includes(normalizedSearch) ||
        report.location_address?.toLowerCase().includes(normalizedSearch) ||
        report.status.toLowerCase().includes(normalizedSearch);

      const matchesStatus = selectedStatus === '' || report.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, selectedStatus]);

  // Dynamic translated table columns array configuration mapping to reportsPage.tableHeaders
  const columns = [
    { header: t('reportsPage.tableHeaders.issueId'), key: 'issue_number' },
    { header: t('reportsPage.tableHeaders.category'), key: 'category_name' },
    { header: t('reportsPage.tableHeaders.location'), key: 'location_address' },
    {
      header: t('reportsPage.tableHeaders.status'),
      key: 'status',
      render: (report: Report) => {
        const normalizedStatus = report.status?.toLowerCase() || '';
        
        // Maps securely to the lowercase keys in your "reports.status" JSON block
        const translatedStatus = t(`reports.status.${normalizedStatus}`, { defaultValue: report.status_display || report.status });

        return (
          <span className={`font-medium whitespace-nowrap ${statusColor(report.status)}`}>
            {translatedStatus}
          </span>
        );
      }
    },
    {
      header: t('reportsPage.tableHeaders.date'),
      key: 'created_at',
      render: (report: Report) => report.created_at ? new Date(report.created_at).toLocaleDateString() : ''
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await privateApi.get('/issues/?mine=true');
        const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        setReports(data);

        const uniqueCategories = Array.from(new Set(data.map((report: Report) => report.category_name).filter(Boolean))) as string[];
        const uniqueSubcategories = Array.from(new Set(data.map((report: Report) => report.subcategory_name).filter(Boolean))) as string[];
        const uniqueLocations = Array.from(new Set(data.map((report: Report) => report.location_address).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
        setSubcategories(uniqueSubcategories);
        setLocations(uniqueLocations);
      } catch (err: any) {
        console.error('Error fetching reports:', err);
        setError(err?.response?.data?.detail || t('reportsPage.errorFallback'));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [t]);

  return (
    <CitizenDashboardLayout>
      <div className="flex flex-col min-h-screen w-full p-3 md:p-12 bg-gray-50/20">
        <div className="max-w-5xl mx-auto w-full">

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex-1 min-w-[250px]">
            <Search
              label={t('navbar.searchPlaceholder')}
              placeholder={t('reportsPage.searchPlaceholder')}
              value={searchTerm}
              options={searchOptions}
              onChange={setSearchTerm}
              onSelect={(option) => setSearchTerm(option.value)}
              className="w-full"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm cursor-pointer outline-none"
          >
            <option value="">{t('reportsPage.allStatuses', 'All Statuses')}</option>
            <option value="submitted">{t('reports.status.submitted', 'Submitted')}</option>
            <option value="in progress">{t('reports.status.in_progress', 'In Progress')}</option>
            <option value="resolved">{t('reports.status.resolved', 'Resolved')}</option>
          </select>

          <button className="flex items-center justify-center gap-1 px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs w-full md:w-auto transition-colors hover:bg-neutral-50 active:bg-neutral-100">
            {t('reportsPage.filterButton')} <Filter size={14} />
          </button>
        </div>

        {/* PAGE SUB-HEADERS */}
        <div className="mb-4">
          <h2 className="text-base md:text-xl font-semibold text-[#4A3728]">
            {t('reportsPage.pageTitle')}
          </h2>
          <p className="text-[#4A3728]/70 text-xs md:text-sm">
            {t('reportsPage.pageSubtitle')}
          </p>
        </div>

        {/* CORE DATA TABLES CANVAS */}
        <div className="bg-white border border-[#4A3728]/10 rounded-md overflow-hidden relative shadow-xs">
          <div ref={tableContainerRef} className="overflow-x-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500 font-medium">{t('reportsPage.loading')}</div>
            ) : error ? (
              <div className="p-4 text-sm text-red-500 font-medium">{error}</div>
            ) : filteredReports.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 font-medium">{t('reportsPage.noReports')}</div>
            ) : (
              <Table
                columns={columns}
                data={filteredReports}
                onRowClick={(report) => navigate(`/reports/${report.id}`)}
              />
            )}
          </div>

          {/* MOBILE RESPONSIVE ARROW ASSIST BUTTON */}
          <button
            type="button"
            onClick={scrollTableRight}
            className="md:hidden absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#4A3728]/20 bg-white text-[#4A3728] shadow-sm active:scale-95 transition-transform"
            aria-label={t('reportsPage.scrollRight') || "Scroll table right"}
          >
            →
          </button>
        </div>
      </div>
      </div>
    </CitizenDashboardLayout>
  );
};

export default MyReportsPage;