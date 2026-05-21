import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { Search, Filter } from 'lucide-react';
import { privateApi } from '../../auth/services/authService';
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
  const normalized = status?.toLowerCase();
  if (normalized === 'in progress' || normalized === 'in_progress') return 'text-yellow-600';
  if (normalized === 'resolved') return 'text-green-700';
  if (normalized === 'submitted') return 'text-[#4A3728]';
  if (normalized === 'rejected') return 'text-red-600';
  return 'text-[#4A3728]';
};

const MyReportsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
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

  // Memoized Search & Selection filter grid parameters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = searchTerm === '' ||
        report.issue_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location_address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === '' || report.category_name === selectedCategory;
      const matchesLocation = selectedLocation === '' || report.location_address === selectedLocation;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [reports, searchTerm, selectedCategory, selectedLocation]);

  // Dynamic translated table columns array configuration
  const columns = [
    { header: t('table.columns.issueId'), key: 'issue_number' },
    { header: t('table.columns.category'), key: 'category_name' },
    { header: t('table.columns.location'), key: 'location_address' },
    {
      header: t('table.columns.status'),
      key: 'status',
      render: (report: Report) => {
        const normalizedStatus = report.status?.toLowerCase() || '';
        
        // Dynamic map extractor matching standard database status translations safely via i18next schema keys
        const translatedStatus = t(`statuses.${normalizedStatus}`, { defaultValue: report.status_display || report.status });

        return (
          <span className={`font-medium whitespace-nowrap ${statusColor(report.status)}`}>
            {translatedStatus}
          </span>
        );
      }
    },
    {
      header: t('table.columns.date'),
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
        const uniqueLocations = Array.from(new Set(data.map((report: Report) => report.location_address).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
      } catch (err: any) {
        console.error('Error fetching reports:', err);
        setError(err?.response?.data?.detail || t('errors.fallback'));
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [t]);

  return (
    <CitizenDashboardLayout>
      <div className="flex flex-col h-full w-full p-3 md:p-12">

        {/* SEARCH & FILTERS CONTROLS */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex items-center w-full border border-[#4A3728]/30 rounded-full px-3 py-1 bg-white">
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs md:text-sm text-[#4A3728]"
            />
            <Search size={14} className="text-[#4A3728]" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm cursor-pointer outline-none"
          >
            <option value="">{t('filters.allCategories')}</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm cursor-pointer outline-none"
          >
            <option value="">{t('filters.allLocations')}</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <button className="flex items-center justify-center gap-1 px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs w-full md:w-auto transition-colors hover:bg-neutral-50 active:bg-neutral-100">
            {t('search.buttonText')} <Filter size={14} />
          </button>
        </div>

        {/* PAGE SUB-HEADERS */}
        <div className="mb-4">
          <h2 className="text-base md:text-xl font-semibold text-[#4A3728]">
            {t('header.title')}
          </h2>
          <p className="text-[#4A3728]/70 text-xs md:text-sm">
            {t('header.subtitle')}
          </p>
        </div>

        {/* CORE DATA TABLES CANVAS */}
        <div className="bg-white border border-[#4A3728]/10 rounded-md overflow-hidden relative shadow-xs">
          <div ref={tableContainerRef} className="overflow-x-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-500 font-medium">{t('table.states.loading')}</div>
            ) : error ? (
              <div className="p-4 text-sm text-red-500 font-medium">{error}</div>
            ) : filteredReports.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 font-medium">{t('table.states.noData')}</div>
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
            aria-label="Scroll table right"
          >
            →
          </button>
        </div>

      </div>
    </CitizenDashboardLayout>
  );
};

export default MyReportsPage;