import { useLayoutEffect, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { privateApi } from '../auth/services/authService';

interface StatusHistoryItem {
    old: string;
    new: string;
    date: string;
    note: string | null;
}

interface IssueDetail {
    id: string;
    issue_number: string;
    description: string;
    category_name: string;
    subcategory_name?: string;
    priority: string;
    status: string;
    status_display: string;
    location_address: string;
    created_at: string;
    image_url?: string | null;
    status_history?: StatusHistoryItem[];
}

const priorityStyles = (priority: string) => {
    const normalized = priority?.toLowerCase();
    if (normalized === 'high') return 'bg-red-600 text-white';
    if (normalized === 'medium') return 'bg-yellow-500 text-white';
    if (normalized === 'low') return 'bg-green-600 text-white';
    return 'bg-[#4A3728] text-white';
};

const statusColor = (status: string) => {
    if (status === 'In Progress') return 'text-yellow-600';
    if (status === 'Resolved') return 'text-green-700';
    if (status === 'Submitted') return 'text-[#4A3728]';
    if (status === 'Rejected') return 'text-red-600';
    return 'text-[#4A3728]';
};

const formatDate = (value: string, locale = 'en-US') => {
    try {
        return new Date(value).toLocaleDateString(locale, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    } catch {
        return value;
    }
};

const IssueDetailPage = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'am' ? 'am-ET' : 'en-US';

    const normalizeStatusKey = (status: string) => {
        const map: Record<string, string> = {
            Submitted: 'submitted',
            'In Progress': 'in_progress',
            Resolved: 'resolved',
            Rejected: 'rejected',
            'Under Review': 'under_review',
        };
        return map[status] || status.toLowerCase().replace(/\s+/g, '_');
    };

    const translateStatus = (status: string) => {
        const key = normalizeStatusKey(status);
        return t(`reports.status.${key}`, status);
    };

    const { id } = useParams<{ id: string }>();

    const [issue, setIssue] = useState<IssueDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reopenLoading, setReopenLoading] = useState(false);

    const fetchIssue = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);

        try {
            const response = await privateApi.get(`/issues/${id}/`);
            setIssue(response.data);
        } catch (err: any) {
            console.error('Error loading issue detail:', err);
            setError(err?.response?.data?.detail || t('issueDetailPage.errorFallback'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const handleReopen = async () => {
        if (!id || reopenLoading) return;

        setReopenLoading(true);

        try {
            await privateApi.post(`/issues/${id}/reopen/`, {});
            toast.success(t('issueDetailPage.reopenSuccess', 'Issue reopened successfully.'));
            await fetchIssue();
        } catch (err: any) {
            console.error('Error reopening issue:', err);
            const message = err?.response?.data?.detail || t('issueDetailPage.reopenError', 'Unable to reopen issue.');
            toast.error(message);
        } finally {
            setReopenLoading(false);
        }
    };

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const timeline = issue
        ? [
            {
                label: t('issueDetailPage.submitted'),
                date: formatDate(issue.created_at, locale),
                note: '',
            },
            ...(issue.status_history ?? []).map((entry) => ({
                label: translateStatus(entry.new),
                date: formatDate(entry.date, locale),
                note: entry.note ?? '',
            })),
        ]
        : [];

    return (
        /* Added vertical spacing (pt-10 / md:pt-16) to ensure the container card sits cleanly below your navbar without overlapping */
        <div className="flex flex-col w-full px-4 pt-10 pb-6 md:px-8 md:pt-8 md:pb-8">
            
            {/* Main Container */}
            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-[#4A3728]/20 bg-white p-4 shadow-sm md:p-6 relative">
                
                {/* Back Button integrated inside the white box */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
                    <Link
                        to="/reports"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#4A3728]/70 hover:text-[#2f1f17] transition-colors"
                    >
                        <ArrowLeft size={14} />
                        {t('issueDetailPage.backToReports')}
                    </Link>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-xs text-[#4A3728]/80">
                        {t('issueDetailPage.loading')}
                    </div>
                ) : error ? (
                    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                        {error}
                    </div>
                ) : issue ? (
                    <>
                        {/* Header Title Block */}
                        <div className="text-center mb-6 pt-4 md:pt-2">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#4A3728]/60">
                                {t('issueDetailPage.pageTitle')}
                            </p>
                            <h1 className="mt-1 text-base font-semibold text-[#4A3728] md:text-lg">
                                {issue.issue_number}
                            </h1>
                        </div>

                        {/* Top info cards */}
                        <div className="grid gap-3 md:grid-cols-2 mb-3">
                            {/* ID + Category */}
                            <div className="rounded-2xl border border-[#4A3728]/10 bg-[#FBF7F4] p-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#4A3728]/60">
                                        {t('issueDetailPage.issueId')}
                                    </span>
                                    <span className="text-[10px] text-[#4A3728]/60">
                                        {t('issueDetailPage.category')}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1.5 text-xs text-[#4A3728]">
                                    <div className="font-medium">{issue.issue_number}</div>
                                    <div>
                                        {issue.category_name}
                                        {issue.subcategory_name ? ` • ${issue.subcategory_name}` : ''}
                                    </div>
                                </div>
                            </div>

                            {/* Priority + Status */}
                            <div className="rounded-2xl border border-[#4A3728]/10 bg-[#FBF7F4] p-4">
                                <div className="grid gap-3 grid-cols-2">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A3728]/60 mb-1.5">
                                            {t('issueDetailPage.priority')}
                                        </div>
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${priorityStyles(issue.priority)}`}
                                        >
                                            {issue.priority}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A3728]/60 mb-1.5">
                                            {t('issueDetailPage.status')}
                                        </div>
                                        <span className={`font-medium text-xs ${statusColor(issue.status)}`}>
                                            {issue.status_display
                                                ? t(
                                                    `reports.status.${normalizeStatusKey(issue.status)}`,
                                                    issue.status_display
                                                )
                                                : translateStatus(issue.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submitted date + Location */}
                        <div className="rounded-2xl border border-[#4A3728]/10 bg-[#FBF7F4] p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A3728]/60 mb-1">
                                        {t('issueDetailPage.submitted')}
                                    </div>
                                    <p className="text-xs text-[#4A3728]">
                                        {formatDate(issue.created_at, locale)}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A3728]/60 mb-1">
                                        {t('issueDetailPage.location', 'Location')}
                                    </div>
                                    <p className="text-xs text-[#4A3728]">
                                        {issue.location_address || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main grid split */}
                        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                            {/* Left column */}
                            <div className="space-y-4">
                                {/* Description */}
                                <div className="rounded-2xl border border-[#4A3728]/10 bg-[#FBF7F4] p-4">
                                    <div className="text-xs font-semibold text-[#4A3728] mb-2">
                                        {t('issueDetailPage.description')}
                                    </div>
                                    <p className="text-xs leading-5 text-[#4A3728]/90">
                                        {issue.description || t('issueDetailPage.noDescription')}
                                    </p>
                                </div>

                                {/* Status Timeline */}
                                <div className="rounded-2xl border border-[#4A3728]/10 bg-[#FBF7F4] p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-[#4A3728]">
                                                {t('issueDetailPage.statusTimeline')}
                                            </p>
                                            <p className="text-[10px] text-[#4A3728]/60 mt-0.5">
                                                {t('issueDetailPage.statusTimelineSubtitle')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {timeline.map((item, index) => (
                                            <div
                                                key={`${item.label}-${index}`}
                                                className="rounded-xl bg-white p-3 shadow-sm"
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4A3728]/10 bg-[#F9F6F2] text-[10px] font-semibold text-[#4A3728]">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-semibold text-[#4A3728]">
                                                                {item.label}
                                                            </span>
                                                            <span className="text-[10px] text-[#4A3728]/60">
                                                                {item.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {item.note ? (
                                                    <p className="mt-2 text-xs text-[#4A3728]/80">
                                                        {item.note}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ))}

                                        {timeline.length === 0 && (
                                            <p className="text-xs text-[#4A3728]/70">
                                                {t('issueDetailPage.noTimeline')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="space-y-4">
                                {/* Issue Photo */}
                                <div className="overflow-hidden rounded-2xl border border-[#4A3728]/10 bg-[#FBF7F4] p-4">
                                    <div className="mb-3 text-xs font-semibold text-[#4A3728]">
                                        {t('issueDetailPage.issuePhoto')}
                                    </div>
                                    <img
                                        src={
                                            issue.image_url ||
                                            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60'
                                        }
                                        alt={t('issueDetailPage.issuePhotoAlt')}
                                        className="h-52 w-full rounded-2xl object-cover"
                                    />
                                </div>

                                {/* Reopen button */}
                                <button
                                    onClick={handleReopen}
                                    disabled={reopenLoading || issue.status.toLowerCase() !== 'resolved'}
                                    className={`w-full rounded-full px-4 py-2.5 text-xs font-semibold text-white transition ${
                                        reopenLoading || issue.status.toLowerCase() !== 'resolved'
                                            ? 'bg-[#A8A296] cursor-not-allowed'
                                            : 'bg-[#4A3728] hover:bg-[#3b2d26]'
                                    }`}
                                >
                                    {reopenLoading
                                        ? t('issueDetailPage.reopening', 'Reopening...')
                                        : t('issueDetailPage.reopenIssue')}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="py-20 text-center text-xs text-[#4A3728]/80">
                        {t('issueDetailPage.notFound')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetailPage;