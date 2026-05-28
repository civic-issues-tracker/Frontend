import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { privateApi } from '../../auth/services/authService';
import ReportList from '../../../components/ui/ReportList';
import Search from '../../../components/ui/Search';
import type { Report } from '../../../components/ui/ReportList';

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

  const searchOptions = useMemo(
    () => [
      ...categories.map((category) => ({ id: `category-${category}`, label: category, value: category })),
      ...subcategories.map((subcategory) => ({ id: `subcategory-${subcategory}`, label: subcategory, value: subcategory })),
      ...locations.map((location) => ({ id: `location-${location}`, label: location, value: location })),
    ],
    [categories, subcategories, locations]
  );

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string> = {
          mine: 'true',
          ordering: '-created_at',
        };

        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedStatus) params.status = selectedStatus;

        const res = await privateApi.get('/issues/', { params });
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
  }, [searchTerm, selectedStatus, t]);

  return (
    <CitizenDashboardLayout>
      <div className="flex flex-col min-h-screen w-full p-3 md:p-12 bg-gray-50/20">
        <div className="max-w-5xl mx-auto w-full">

        {/* PAGE SUB-HEADERS */}
        <div className="mb-4">
          <h2 className="text-base md:text-xl font-semibold text-[#4A3728]">
            {t('reportsPage.pageTitle')}
          </h2>
          <p className="text-[#4A3728]/70 text-xs md:text-sm">
            {t('reportsPage.pageSubtitle')}
          </p>
        </div>

        <div className="mb-4">
          <Search
            label={t('navbar.searchPlaceholder')}
            placeholder={t('reportsPage.searchPlaceholder')}
            value={searchTerm}
            options={searchOptions}
            onChange={setSearchTerm}
            onSelect={(option) => setSearchTerm(option.value)}
            onSubmit={() => undefined}
            className="w-full"
            statusValue={selectedStatus}
            statusOptions={[
              { label: t('reports.status.submitted', 'Submitted'), value: 'submitted' },
              { label: t('reports.status.in_progress', 'In Progress'), value: 'in_progress' },
              { label: t('reports.status.resolved', 'Resolved'), value: 'resolved' },
              { label: t('reports.status.rejected', 'Rejected'), value: 'rejected' },
              { label: t('reports.status.pending_admin', 'Pending Admin'), value: 'pending_admin' },
              { label: t('reports.status.escalated', 'Escalated'), value: 'escalated' },
            ]}
            onStatusChange={setSelectedStatus}
          />
        </div>

        <ReportList
          reports={reports}
          loading={loading}
          error={error}
          onRowClick={(report) => navigate(`/reports/${report.id}`)}
        />
      </div>
      </div>
    </CitizenDashboardLayout>
  );
};

export default MyReportsPage;