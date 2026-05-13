import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  if (status === 'In Progress') return 'text-yellow-600';
  if (status === 'Resolved') return 'text-green-700';
  if (status === 'Submitted') return 'text-[#4A3728]';
  if (status === 'Rejected') return 'text-red-600';
  return 'text-[#4A3728]';
};

const MyReportsPage = () => {
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
    { header: 'Issue ID', key: 'issue_number' },
    { header: 'Category', key: 'category_name' },
    { header: 'Location', key: 'location_address' },
    {
      header: 'Status',
      key: 'status',
      render: (report: Report) => (
        <span className={`font-medium whitespace-nowrap ${statusColor(report.status)}`}>
          {report.status_display || report.status}
        </span>
      )
    },
    {
      header: 'Date',
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
        const res = await privateApi.get('/issues/?mine=true');
        // Handle both flat array and paginated response formats
        const data = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        setReports(data);

        const uniqueCategories = Array.from(new Set(data.map((report: Report) => report.category_name).filter(Boolean))) as string[];
        const uniqueLocations = Array.from(new Set(data.map((report: Report) => report.location_address).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
      } catch (error: any) {
        console.error('Error fetching reports:', error);
        setError(error?.response?.data?.detail || 'Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <CitizenDashboardLayout>
      <div className="flex flex-col h-full w-full p-3 md:p-12">

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex items-center w-full border border-[#4A3728]/30 rounded-full px-3 py-1 bg-white">
            <input
              type="text"
              placeholder="Search reports..."
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
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs md:text-sm"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <button className="flex items-center justify-center gap-1 px-3 py-1 border border-[#4A3728]/30 rounded bg-white text-[#4A3728] text-xs w-full md:w-auto">
            Filter Reports <Filter size={14} />
          </button>
        </div>

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-base md:text-xl font-semibold text-[#4A3728]">
            All Reports
          </h2>
          <p className="text-[#4A3728]/70 text-xs md:text-sm">
            Track the all the issues reported
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-[#4A3728]/10 rounded-md overflow-hidden relative">
          <div ref={tableContainerRef} className="overflow-x-auto">
            {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading reports...</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">{error}</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No reports found.</div>
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