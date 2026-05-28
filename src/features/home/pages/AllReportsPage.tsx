import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { publicApi } from '../../auth/services/authService';
import ReportList from '../../../components/ui/ReportList';
import Search from '../../../components/ui/Search';
import type { Report } from '../../../components/ui/ReportList';

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
          ordering: '-created_at',
        };

        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedStatus) params.status = selectedStatus;

        const res = await publicApi.get('/issues/', { params });
        const rawData = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
        const visibleData = rawData.filter((report: Report) => report.status?.toLowerCase() !== 'rejected');

        setReports(visibleData);

        const uniqueCategories = Array.from(new Set(visibleData.map((report: Report) => report.category_name).filter(Boolean))) as string[];
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
  }, [searchTerm, selectedStatus]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div className="flex flex-col h-full w-full p-3 md:p-12 min-h-screen bg-gray-50/30">
        <div className="max-w-5xl mx-auto w-full">

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
  );
};

export default AllReportsPage;