import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
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

    useEffect(() => {
        const fetchIssue = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);

            try {
                const response = await privateApi.get(`/issues/${id}/`);
                setIssue(response.data);
            } catch (err: any) {
                console.error('Error loading issue detail:', err);
                setError(err?.response?.data?.detail || 'Unable to load issue detail.');
            } finally {
                setLoading(false);
            }
        };

        fetchIssue();
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
        <div className="flex flex-col w-full p-4 md:p-12">
            <div className="mb-6">
                <Link
                    to="/reports"
                    className="inline-flex items-center gap-2 text-sm text-[#4A3728] hover:text-[#2f1f17]"
                >
                    <ArrowLeft size={16} /> {t('issueDetailPage.backToReports')}
                </Link>
            </div>

            <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-[#4A3728]/20 bg-white p-6 shadow-sm md:p-10">
                {loading ? (
                    <div className="py-16 text-center text-sm text-[#4A3728]/80">
                        {t('issueDetailPage.loading')}
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                        {error}
                    </div>
                ) : issue ? (
                    <>
                        <div className="text-center">
                            <p className="text-xs uppercase tracking-[0.3em] text-[#4A3728]/60">
                                {t('issueDetailPage.pageTitle')}
                            </p>
                            <h1 className="mt-2 text-xl font-semibold text-[#4A3728] md:text-2xl">
                                {issue.issue_number}
                            </h1>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <div className="rounded-3xl border border-[#4A3728]/10 bg-[#FBF7F4] p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[12px] uppercase tracking-[0.24em] text-[#4A3728]/70">
                                        {t('issueDetailPage.issueId')}
                                    </span>
                                    <span className="text-xs text-[#4A3728]/70">
                                        {t('issueDetailPage.category')}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-col gap-3 text-sm text-[#4A3728]">
                                    <div className="font-medium">{issue.issue_number}</div>

                                    <div>
                                        {issue.category_name}
                                        {issue.subcategory_name
                                            ? ` • ${issue.subcategory_name}`
                                            : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#4A3728]/10 bg-[#FBF7F4] p-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <div className="text-[12px] uppercase tracking-[0.24em] text-[#4A3728]/70">
                                            {t('issueDetailPage.priority')}
                                        </div>

                                        <span
                                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles(issue.priority)}`}
                                        >
                                            {issue.priority}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-[12px] uppercase tracking-[0.24em] text-[#4A3728]/70">
                                            {t('issueDetailPage.status')}
                                        </div>

                                        <span
                                            className={`mt-2 font-medium text-sm ${statusColor(issue.status)}`}
                                        >
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

                        <div className="mt-6 rounded-3xl border border-[#4A3728]/10 bg-[#FBF7F4] p-5 md:p-7">
                            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
                                <div>
                                    <div className="text-[12px] uppercase tracking-[0.24em] text-[#4A3728]/70">
                                        {t('issueDetailPage.submitted')}
                                    </div>

                                    <p className="mt-2 text-sm text-[#4A3728]">
                                        {formatDate(issue.created_at, locale)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                            <div className="space-y-6">
                                <div className="rounded-3xl border border-[#4A3728]/10 bg-[#FBF7F4] p-6">
                                    <div className="text-sm font-semibold text-[#4A3728]">
                                        {t('issueDetailPage.description')}
                                    </div>

                                    <p className="mt-4 text-sm leading-6 text-[#4A3728]/90">
                                        {issue.description ||
                                            t('issueDetailPage.noDescription')}
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-[#4A3728]/10 bg-[#FBF7F4] p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-[#4A3728]">
                                                {t('issueDetailPage.statusTimeline')}
                                            </p>

                                            <p className="text-xs text-[#4A3728]/60">
                                                {t('issueDetailPage.statusTimelineSubtitle')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {timeline.map((item, index) => (
                                            <div
                                                key={`${item.label}-${index}`}
                                                className="rounded-2xl bg-white p-4 shadow-sm"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4A3728]/10 bg-[#F9F6F2] text-xs font-semibold text-[#4A3728]">
                                                        {index + 1}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm font-semibold text-[#4A3728]">
                                                                {item.label}
                                                            </span>

                                                            <span className="text-xs text-[#4A3728]/60">
                                                                {item.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {item.note ? (
                                                    <p className="mt-3 text-sm text-[#4A3728]/80">
                                                        {item.note}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ))}

                                        {timeline.length === 0 && (
                                            <p className="text-sm text-[#4A3728]/70">
                                                {t('issueDetailPage.noTimeline')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="overflow-hidden rounded-3xl border border-[#4A3728]/10 bg-[#FBF7F4] p-6">
                                    <div className="mb-4 text-sm font-semibold text-[#4A3728]">
                                        {t('issueDetailPage.issuePhoto')}
                                    </div>

                                    <img
                                        src={
                                            issue.image_url ||
                                            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60'
                                        }
                                        alt="Issue"
                                        className="h-72 w-full rounded-3xl object-cover"
                                    />
                                </div>

                                <button className="w-full rounded-full bg-[#4A3728] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b2d26]">
                                    {t('issueDetailPage.reopenIssue')}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="py-16 text-center text-sm text-[#4A3728]/80">
                        {t('issueDetailPage.notFound')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetailPage;