import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Bell, CircleAlert, FileText, X } from 'lucide-react';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { privateApi } from '../../auth/services/authService';

interface IssueDetail {
  id: string;
  title: string;
  description: string;
  status?: string | null;
  image?: string | null;
  issue_number?: string | null;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  issue_number?: string | null;
  issue?: string | null;
  metadata?: {
    old_status?: string;
    new_status?: string;
    reason?: string;
    note_preview?: string;
    [key: string]: unknown;
  };
}

const getStatusBadgeStyle = (status?: string | null) => {
  if (!status) return 'bg-gray-100 text-gray-700';

  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'open':
    case 'pending':
    case 'submitted':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    case 'in_progress':
    case 'in progress':
    case 'investigating':
      return 'bg-blue-50 text-blue-700 border border-blue-200/60';
    case 'resolved':
    case 'closed':
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    case 'rejected':
    case 'cancelled':
    case 'declined':
      return 'bg-red-50 text-red-700 border border-red-200/60';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200/60';
  }
};

const fetchNotifications = async (): Promise<NotificationItem[]> => {
  const res = await privateApi.get('/notifications/');
  return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
};

const NotificationSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse rounded-[26px] border border-gray-100 bg-white px-4 py-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-full bg-gray-200" />
              <div className="h-5 w-12 rounded-full bg-gray-200" />
            </div>
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="h-3 w-2/3 rounded bg-gray-100" />
          </div>
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

const NotificationPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issueData, setIssueData] = useState<IssueDetail | null>(null);
  const [isFetchingIssue, setIsFetchingIssue] = useState<boolean>(false);

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery<NotificationItem[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 10000,
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      await privateApi.post('/notifications/mark-read/', { read_all: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    const hasUnread = notifications.some((item) => !item.is_read);
    if (hasUnread && !markReadMutation.isPending) {
      const timer = setTimeout(() => {
        markReadMutation.mutate();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const rejectionCount = useMemo(
    () =>
      notifications.filter((item) => item.notification_type === 'rejection')
        .length,
    [notifications]
  );

  const errorMessage =
    isError && error
      ? (error as any)?.response?.data?.detail ||
        error.message ||
        t('notifications.errorFallback', 'Unable to load notifications.')
      : null;

  const handleNotificationClick = async (item: NotificationItem) => {
    const issueId = item.issue || item.issue_number;
    if (!issueId) return;

    setSelectedIssueId(issueId);
    setIsFetchingIssue(true);

    try {
      const res = await privateApi.get(`/issues/${issueId}/`);
      setIssueData({
        id: res.data.id || issueId,
        issue_number: res.data.issue_number || item.issue_number,
        title: res.data.title || item.title,
        description: res.data.description || item.message,
        status: res.data.status || item.metadata?.new_status || null,
        image: res.data.image_url || res.data.attachment_url || null,
      });
    } catch {
      // Fallback display if endpoint fetch fails
      setIssueData({
        id: issueId,
        issue_number: item.issue_number,
        title: item.title,
        description: item.message,
        status: item.metadata?.new_status || null,
        image: null,
      });
    } finally {
      setIsFetchingIssue(false);
    }
  };

  const closeModal = () => {
    setSelectedIssueId(null);
    setIssueData(null);
  };

  return (
    <CitizenDashboardLayout>
      <div className="min-h-screen bg-[#F8F9FB] px-4 py-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-4">
          {/* Header */}
          <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>

                <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                  {t('notifications.title', 'Notifications')}
                </h1>

                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  {t(
                    'notifications.subtitle',
                    'Stay updated with issue progress and status changes.'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-2">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {notifications.length}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    {t('notifications.total', 'Total')}
                  </p>
                </div>

                {rejectionCount > 0 && (
                  <div className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                    {rejectionCount}{' '}
                    {t('notifications.rejectedCount', 'rejected')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Loading & Error States */}
          {isLoading ? (
            <NotificationSkeleton />
          ) : errorMessage ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              {errorMessage}
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-gray-200 bg-white py-10 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>

              <h2 className="text-base font-semibold text-gray-800">
                {t('notifications.emptyTitle', 'No notifications yet')}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {t(
                  'notifications.emptySubtitle',
                  'Issue updates will appear here.'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => {
                const rejectionReason =
                  item.metadata?.reason ||
                  item.metadata?.note_preview ||
                  null;

                const oldStatus = item.metadata?.old_status;
                const newStatus = item.metadata?.new_status;

                return (
                  <article
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className="cursor-pointer rounded-[26px] border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                      {/* Left Content */}
                      <div className="flex-1">
                        {/* Badges */}
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium capitalize text-gray-700">
                            {t(
                              `notifications.types.${item.notification_type}`,
                              item.notification_type.replace('_', ' ')
                            )}
                          </span>

                          {item.issue_number && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700">
                              <FileText className="h-3 w-3" />#{item.issue_number}
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              item.is_read
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.is_read
                              ? t('notifications.statusRead', 'Read')
                              : t('notifications.statusNew', 'New')}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </h2>

                        {/* Message */}
                        <p className="mt-1 text-xs leading-5 text-gray-600">
                          {item.message}
                        </p>

                        {/* Status update */}
                        {(oldStatus || newStatus) && (
                          <div className="mt-3 flex items-center flex-wrap gap-1.5 rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
                            <span className="font-medium">
                              {t('notifications.status', 'Status')}:
                            </span>{' '}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusBadgeStyle(
                                oldStatus
                              )}`}
                            >
                              {oldStatus
                                ? oldStatus.replace('_', ' ')
                                : t('notifications.unknown', 'Unknown')}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusBadgeStyle(
                                newStatus
                              )}`}
                            >
                              {newStatus
                                ? newStatus.replace('_', ' ')
                                : t('notifications.unknown', 'Unknown')}
                            </span>
                          </div>
                        )}

                        {/* Rejection reason */}
                        {rejectionReason && (
                          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-red-700">
                              <CircleAlert className="h-3.5 w-3.5" />
                              {t(
                                'notifications.rejectionReason',
                                'Rejection reason'
                              )}
                            </div>

                            <p className="text-xs leading-5 text-red-800">
                              {rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Date */}
                      <div className="shrink-0 md:text-right">
                        <p className="text-[10px] font-medium text-gray-400">
                          {t('notifications.sent', 'Sent')}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-600">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightweight Issue Preview Modal */}
      {selectedIssueId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[28px] border border-gray-100 bg-white p-6 shadow-xl">
            {/* Header / Close */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <FileText className="h-3.5 w-3.5" />
                  #{issueData?.issue_number || selectedIssueId}
                </span>
                {issueData?.status && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeStyle(
                      issueData.status
                    )}`}
                  >
                    {issueData.status.replace('_', ' ')}
                  </span>
                )}
              </div>

              <button
                onClick={closeModal}
                className="rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            {isFetchingIssue ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Loading issue preview...
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {issueData?.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {issueData?.description}
                  </p>
                </div>

                {issueData?.image ? (
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                    <img
                      src={issueData.image}
                      alt={issueData.title}
                      className="max-h-64 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-400">
                    No image attached to this issue.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </CitizenDashboardLayout>
  );
};

export default NotificationPage;