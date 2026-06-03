import { useEffect, useMemo, useState } from 'react';
import { Bell, CircleAlert, FileText, Loader2 } from 'lucide-react';
import CitizenDashboardLayout from '../CitizenDashboardLayout';
import { privateApi } from '../../auth/services/authService';

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

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await privateApi.get('/notifications/');
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.results ?? []);

        setNotifications(data as NotificationItem[]);
      } catch (err: any) {
        console.error('Failed to load notifications:', err);

        setError(
          err?.response?.data?.detail ||
            err?.message ||
            'Unable to load notifications.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const interval = window.setInterval(fetchNotifications, 10000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));

        await privateApi.post('/notifications/mark-read/', {
          read_all: true,
        });
      } catch (err) {
        console.error(
          'Failed to mark notifications as read:',
          err
        );
      }
    };

    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, [notifications.length]);

  const rejectionCount = useMemo(
    () =>
      notifications.filter(
        (item) => item.notification_type === 'rejection'
      ).length,
    [notifications]
  );

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
                  Notifications
                </h1>

                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  Stay updated with issue progress and status changes.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-2">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {notifications.length}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Total
                  </p>
                </div>

                {rejectionCount > 0 && (
                  <div className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                    {rejectionCount} rejected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center rounded-[28px] border border-gray-100 bg-white py-8 shadow-sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />

              <span className="text-sm text-gray-600">
                Loading notifications...
              </span>
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-gray-200 bg-white py-10 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>

              <h2 className="text-base font-semibold text-gray-800">
                No notifications yet
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Issue updates will appear here.
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
                    className="rounded-[26px] border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:justify-between">

                      {/* Left Content */}
                      <div className="flex-1">

                        {/* Badges */}
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium capitalize text-gray-700">
                            {item.notification_type.replace(
                              '_',
                              ' '
                            )}
                          </span>

                          {item.issue_number && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700">
                              <FileText className="h-3 w-3" />
                              #{item.issue_number}
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              item.is_read
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.is_read ? 'Read' : 'New'}
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
                          <div className="mt-3 rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
                            <span className="font-medium">
                              Status:
                            </span>{' '}
                            {oldStatus || 'Unknown'} →{' '}
                            {newStatus || 'Unknown'}
                          </div>
                        )}

                        {/* Rejection reason */}
                        {rejectionReason && (
                          <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-red-700">
                              <CircleAlert className="h-3.5 w-3.5" />
                              Rejection reason
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
                          Sent
                        </p>

                        <p className="mt-1 text-[11px] text-gray-600">
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
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
    </CitizenDashboardLayout>
  );
};

export default NotificationPage;