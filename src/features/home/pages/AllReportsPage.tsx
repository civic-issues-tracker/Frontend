import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import Search from '../../../components/ui/Search';
import { publicApi } from '../../auth/services/authService';
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
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === 'in progress') return 'text-yellow-600';
  if (normalizedStatus === 'resolved') return 'text-green-700';
  if (normalizedStatus === 'submitted') return 'text-[#4A3728]';
  if (normalizedStatus === 'rejected') return 'text-red-600';
  return 'text-[#4A3728]';
};

const AllReportsPage = () => {
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

  // Updated handler to scroll both left and right dynamically
  const handleTableScroll = (direction: 'left' | 'right') => {
    if (!tableContainerRef.current) return;
    const scrollAmount = direction === 'right' ? 240 : -240;
    tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const filteredReports = reports.filter(report => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      report.category_name.toLowerCase().includes(normalizedSearch) ||
      report.subcategory_name?.toLowerCase().includes(normalizedSearch) ||
      report.location_address.toLowerCase().includes(normalizedSearch) ||
      report.issue_number?.toLowerCase().includes(normalizedSearch) ||
      report.status.toLowerCase().includes(normalizedSearch);
    
    const matchesStatus = selectedStatus === '' || report.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      header: t('reportsPage.tableHeaders.category'), 
      key: 'category_name',
      className: 'w-[20%] min-w-[140px]' 
    },
    { 
      header: t('reportsPage.tableHeaders.location'), 
      key: 'location_address',
      className: 'w-[50%] min-w-[250px]' 
    },
    {
      header: t('reportsPage.tableHeaders.status'),
      key: 'status',
      className: 'w-[15%] min-w-[100px]',
      render: (report: Report) => (
        <span className={`font-medium whitespace-nowrap ${statusColor(report.status)}`}>
          {report.status_display || report.status}
        </span>
      )
    },
    {
      header: t('reportsPage.tableHeaders.date'),
      key: 'created_at',
      className: 'w-[15%] min-w-[100px]',
      render: (report: Report) => new Date(report.created_at).toLocaleDateString()
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicApi.get('/issues/');
        const rawData = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        setReports(rawData);

        const uniqueCategories = Array.from(new Set(rawData.map((report: Report) => report.category_name).filter(Boolean))) as string[];
        const uniqueSubcategories = Array.from(new Set(rawData.map((report: Report) => report.subcategory_name).filter(Boolean))) as string[];
        const uniqueLocations = Array.from(new Set(rawData.map((report: Report) => report.location_address).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
        setSubcategories(uniqueSubcategories);
        setLocations(uniqueLocations);
      } catch (error: any) {
        console.error('Error fetching reports:', error);
        setError(error?.response?.data?.detail || error?.message || 'Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div className="flex flex-col h-full w-full p-3 md:p-12 min-h-screen bg-gray-50/30">
        <div className="max-w-5xl mx-auto w-full">

          {/* SEARCH */}
          <div className="flex flex-col md:flex-row gap-2 mb-4 items-end">
            <div className="flex-1 min-w-[250px]">
              <Search
                label=""
                placeholder={t('reportsPage.searchPlaceholder')}
                value={searchTerm}
                options={searchOptions}
                onChange={setSearchTerm}
                onSelect={(option) => setSearchTerm(option.value)}
                isLoading={loading}
                className="w-full"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm h-11 focus:outline-none focus:ring-1 focus:ring-[#4A3728]/50"
            >
              <option value="">{t('reportsPage.allStatuses', 'All Statuses')}</option>
              <option value="submitted">{t('reports.status.submitted', 'Submitted')}</option>
              <option value="in progress">{t('reports.status.in_progress', 'In Progress')}</option>
              <option value="resolved">{t('reports.status.resolved', 'Resolved')}</option>
            </select>

            <button className="flex items-center justify-center gap-1 px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs w-full md:w-auto h-11 hover:bg-gray-50 active:scale-[0.99] transition-all">
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

          {/* TABLE CONTAINER CARD - Set to relative positioning to anchor floating buttons inside */}
          <div className="relative w-full bg-white border border-[#4A3728]/10 rounded-xl overflow-hidden shadow-sm">
            
            {/* FLOATING ACTION BUTTONS (MOBILE VIEW ONLY) */}
            <div className="md:hidden absolute right-3 top-3 z-10 flex gap-2">
              {/* Scroll Left Button */}
              <button
                type="button"
                onClick={() => handleTableScroll('left')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#4A3728]/20 bg-white text-[#4A3728] shadow-sm active:scale-95 transition-transform font-bold"
                aria-label="Scroll Left"
              >
                ←
              </button>
              
              {/* Scroll Right Button */}
              <button
                type="button"
                onClick={() => handleTableScroll('right')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#4A3728]/20 bg-white text-[#4A3728] shadow-sm active:scale-95 transition-transform font-bold"
                aria-label="Scroll Right"
              >
                →
              </button>
            </div>

            <div ref={tableContainerRef} className="overflow-x-auto w-full pt-14 md:pt-0">
              {loading ? (
                <div className="p-4 text-sm text-gray-500">{t('reportsPage.loading')}</div>
              ) : error ? (
                <div className="p-4 text-sm text-red-500">{error || t('reportsPage.errorFallback')}</div>
              ) : filteredReports.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">{t('reportsPage.noReports')}</div>
              ) : (
                <Table
                  columns={columns}
                  data={filteredReports}
                  onRowClick={(report) => navigate(`/reports/${report.id}`)}
                />
              )}
            </div>

          </div>

        </div>
      </div>
  );
};

export default AllReportsPage;