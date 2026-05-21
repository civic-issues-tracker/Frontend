import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { publicApi } from '../../auth/services/authService';
import Table from '../../../components/ui/Table';

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

const AllReportsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollTableRight = () => {
    if (!tableContainerRef.current) return;
    tableContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
  };

  // Filter reports based on search criteria
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.issue_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || report.category_name === selectedCategory;
    const matchesLocation = selectedLocation === '' || report.location_address === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const columns = [
    { header: t('reportsPage.tableHeaders.issueId'), key: 'issue_number' },
    { header: t('reportsPage.tableHeaders.category'), key: 'category_name' },
    { header: t('reportsPage.tableHeaders.location'), key: 'location_address' },
    {
      header: t('reportsPage.tableHeaders.status'),
      key: 'status',
      render: (report: Report) => (
        <span className={`font-medium whitespace-nowrap ${statusColor(report.status)}`}>
          {report.status_display || report.status}
        </span>
      )
    },
    {
      header: t('reportsPage.tableHeaders.date'),
      key: 'created_at',
      render: (report: Report) => new Date(report.created_at).toLocaleDateString()
    }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all issues from the database
        const res = await publicApi.get('/issues/');
        // Handle both flat array and paginated response formats
        const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        setReports(data);
        
        // Extract unique categories and locations from the reports
        const uniqueCategories = Array.from(new Set(data.map((report: Report) => report.category_name).filter(Boolean))) as string[];
        const uniqueLocations = Array.from(new Set(data.map((report: Report) => report.location_address).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
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
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <div className="flex items-center w-full border border-[#4A3728]/30 rounded-full px-3 py-1 bg-white">
              <input
                type="text"
                placeholder={t('reportsPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-xs md:text-sm text-[#4A3728]"
              />
              <Search size={14} className="text-[#4A3728]" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm"
            >
              <option value="">{t('reportsPage.allCategories')}</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm"
            >
              <option value="">{t('reportsPage.allLocations')}</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

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
          <div className="bg-white border border-[#4A3728]/10 rounded-md overflow-hidden relative overflow-x-auto">
            <div ref={tableContainerRef} className="overflow-x-auto">
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
      </div>
  );
};

export default AllReportsPage;
