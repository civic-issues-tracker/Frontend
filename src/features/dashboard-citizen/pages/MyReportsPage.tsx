import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { privateApi } from '../../auth/services/authService';
import ReportList from '../../../components/ui/ReportList';
import Search from '../../../components/ui/Search';
import type { Report } from '../../../components/ui/ReportList';

const ReportListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="animate-pulse rounded-[26px] border border-gray-100 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-20 rounded-full bg-gray-200" />
              <div className="h-5 w-24 rounded-full bg-gray-200" />
            </div>
            <div className="h-5 w-2/3 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-2xl bg-gray-200" />
            <div className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MyReportsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Use TanStack Query to load and cache the reports list smoothly
  const { data, error, isLoading } = useQuery({
    queryKey: ['myReports', searchTerm, selectedStatus],
    queryFn: async () => {
      const params: Record<string, string> = {
        mine: 'true',
        ordering: '-created_at',
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedStatus) params.status = selectedStatus;

      const res = await privateApi.get('/issues/', { params });
      const rawReports = Array.isArray(res.data)
        ? res.data
        : res.data.results ?? [];

      // Calculate search filter options inside the queryFn to keep it structured and run once per load
      const uniqueCategories = Array.from(
        new Set(
          rawReports
            .map((report: Report) => report.category_name)
            .filter(Boolean)
        )
      ) as string[];
      const uniqueSubcategories = Array.from(
        new Set(
          rawReports
            .map((report: Report) => report.subcategory_name)
            .filter(Boolean)
        )
      ) as string[];
      const uniqueLocations = Array.from(
        new Set(
          rawReports
            .map((report: Report) => report.location_address)
            .filter(Boolean)
        )
      ) as string[];

      return {
        reports: rawReports as Report[],
        categories: uniqueCategories,
        subcategories: uniqueSubcategories,
        locations: uniqueLocations,
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // Extract reports and filters safely with default structures
  const reports = data?.reports ?? [];
  const categories = data?.categories ?? [];
  const subcategories = data?.subcategories ?? [];
  const locations = data?.locations ?? [];

  const searchOptions = useMemo(
    () => [
      ...categories.map((category) => ({
        id: `category-${category}`,
        label: category,
        value: category,
      })),
      ...subcategories.map((subcategory) => ({
        id: `subcategory-${subcategory}`,
        label: subcategory,
        value: subcategory,
      })),
      ...locations.map((location) => ({
        id: `location-${location}`,
        label: location,
        value: location,
      })),
    ],
    [categories, subcategories, locations]
  );

  // Safely capture and format errors from the hook
  const queryError = error
    ? (error as any)?.response?.data?.detail || t('reportsPage.errorFallback')
    : null;

  return (
    <CitizenDashboardLayout>
      <div className="flex min-h-screen w-full flex-col bg-primary p-3 md:p-12">
        <div className="mx-auto w-full max-w-5xl">
          {/* PAGE SUB-HEADERS */}
          <div className="mb-4">
            <h2 className="text-base font-semibold tracking-tight text-secondary md:text-xl">
              {t('reportsPage.pageTitle')}
            </h2>
            <p className="text-xs text-secondary/90 md:text-sm">
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
                {
                  label: t('reports.status.submitted', 'Submitted'),
                  value: 'submitted',
                },
                {
                  label: t('reports.status.in_progress', 'In Progress'),
                  value: 'in_progress',
                },
                {
                  label: t('reports.status.resolved', 'Resolved'),
                  value: 'resolved',
                },
                {
                  label: t('reports.status.rejected', 'Rejected'),
                  value: 'rejected',
                },
                {
                  label: t('reports.status.pending_admin', 'Pending Admin'),
                  value: 'pending_admin',
                },
                {
                  label: t('reports.status.escalated', 'Escalated'),
                  value: 'escalated',
                },
              ]}
              onStatusChange={setSelectedStatus}
            />
          </div>

          {isLoading ? (
            <ReportListSkeleton />
          ) : (
            <ReportList
              reports={reports}
              loading={false}
              error={queryError}
              onRowClick={(report) => navigate(`/reports/${report.id}`)}
            />
          )}
        </div>
      </div>
    </CitizenDashboardLayout>
  );
};

export default MyReportsPage;