import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { buildOfficerWorkspace } from '../officerWorkspace';

const kpis = [
	{ label: 'Resolved (30d)', value: '84' },
	{ label: 'Avg Resolve Time', value: '1.9d' },
	{ label: 'Citizen Satisfaction', value: '92%' },
	{ label: 'Escalations', value: '3' },
];

const OfficerAnalyticsPage = () => {
	const { user } = useAuth();
	const workspace = useMemo(
		() => buildOfficerWorkspace(user?.email ?? user?.id ?? user?.full_name),
		[user?.email, user?.id, user?.full_name],
	);
	const [activeReportId, setActiveReportId] = useState<string | null>(workspace.resolvedTickets[0]?.id ?? null);
	const activeReport = activeReportId
		? workspace.resolvedTickets.find((ticket) => ticket.id === activeReportId) ?? null
		: null;

	return (
		<section>
			<header className="mb-3 flex items-start justify-between">
				<div>
					<h2 className="text-[30px] font-black leading-tight text-[#3E2B1F]">Resolved Tickets</h2>
					<p className="text-sm text-[#857060]">Archive of previously resolved and closed issues.</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center rounded-full border border-[#DDCFC0] bg-[#F8F6F2] px-3 py-1.5">
						<Search size={14} className="mr-1 text-[#9D8A78]" />
						<input placeholder="Search ticket ID or address..." className="w-56 bg-transparent text-xs outline-none" />
					</div>
					<button className="rounded-full border border-[#DDCFC0] bg-[#F8F6F2] p-2 text-[#8B7B69]">◯</button>
				</div>
			</header>

			<div className="min-h-[81vh] rounded-2xl border border-[#D8CCBD] bg-[#F6F2EC] p-4">
				<div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
					{kpis.map((kpi) => (
						<div key={kpi.label} className="rounded-xl border border-[#DDD0C2] bg-white p-3">
							<p className="text-[10px] uppercase tracking-widest text-[#8D7968]">{kpi.label}</p>
							<p className="mt-1 text-2xl font-black text-[#3E2B1F]">{kpi.value}</p>
						</div>
					))}
				</div>

				<div className="mb-3 flex items-center justify-between">
					<div>
						<h3 className="text-xl font-bold text-[#3C2A1D]">Archived & Resolved</h3>
						<p className="text-sm text-[#8B7868]">Review past issues and view their resolution reports for {user?.full_name || 'the current officer'}.</p>
					</div>
					<div className="flex gap-2 text-xs">
						<button className="rounded-full border border-[#D8CCBD] bg-white px-3 py-1">Filter by Date</button>
						<button className="rounded-full bg-[#6A4834] px-3 py-1 text-white">Export Report</button>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-[#DDD0C2] bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-[#F4EEE6] text-xs uppercase tracking-wide text-[#7D6A59]">
							<tr>
								<th className="px-4 py-3">Ticket ID</th>
								<th className="px-4 py-3">Issue Description</th>
								<th className="px-4 py-3">Category</th>
								<th className="px-4 py-3">Resolution Date</th>
								<th className="px-4 py-3">Action</th>
							</tr>
						</thead>
						<tbody>
							{workspace.resolvedTickets.map((ticket) => (
								<tr key={ticket.id} className="border-t border-[#EFE4D8] text-[#3B2A1E]">
									<td className="px-4 py-3 font-bold">{ticket.id}</td>
									<td className="px-4 py-3 font-semibold">{ticket.title}</td>
									<td className="px-4 py-3">
										<span className="rounded-full bg-[#EEE6DB] px-2 py-1 text-xs">{ticket.category}</span>
									</td>
									<td className="px-4 py-3 text-[#7D6958]">{ticket.resolutionDate}</td>
									<td className="px-4 py-3">
										<button
											onClick={() => setActiveReportId(ticket.id)}
											className="rounded-full border border-[#DCCFC1] px-3 py-1 text-xs font-semibold"
										>
											View Report
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="mt-3 rounded-xl border border-[#DDD0C2] bg-white p-3">
					<h4 className="mb-2 text-sm font-bold text-[#3E2B1F]">Resolution Trend Notes</h4>
					<p className="text-sm text-[#6B5646]">
						Roads & Infrastructure and Lighting categories are trending faster than last month. Three tickets were escalated due to delayed third-party dependencies.
					</p>
				</div>

				{activeReport ? (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
						<div className="w-full max-w-2xl rounded-3xl border border-[#E5D7C6] bg-[#FCF8F2] p-5 shadow-2xl">
							<div className="flex items-start justify-between gap-4 border-b border-[#E8DCCD] pb-3">
								<div>
									<p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8E7A69]">Resolution Report</p>
									<h3 className="mt-1 text-2xl font-black text-[#3E2B1F]">{activeReport.id}</h3>
								</div>
								<button onClick={() => setActiveReportId('')} className="rounded-full border border-[#D8CCBD] bg-white p-2 text-[#7D6A59]" aria-label="Close report">
									<X size={16} />
								</button>
							</div>
							<div className="mt-4 grid gap-3 md:grid-cols-2">
								<div className="rounded-2xl border border-[#E6D8C8] bg-white p-4">
									<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8B7868]">Issue</p>
									<p className="mt-2 text-lg font-bold text-[#3A2A1E]">{activeReport.title}</p>
									<p className="mt-1 text-sm text-[#6B5646]">{activeReport.location}</p>
								</div>
								<div className="rounded-2xl border border-[#E6D8C8] bg-white p-4">
									<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8B7868]">Resolution</p>
									<p className="mt-2 text-lg font-bold text-[#3A2A1E]">{activeReport.resolutionDate}</p>
									<p className="mt-1 text-sm text-[#6B5646]">Category: {activeReport.category}</p>
								</div>
								<div className="rounded-2xl border border-[#E6D8C8] bg-white p-4 md:col-span-2">
									<p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8B7868]">Officer Notes</p>
									<p className="mt-2 text-sm text-[#5E4A3A]">
										This report view is currently driven by officer dashboard data. When backend reports are available, this panel should open the resolved issue record with photos, timeline, crew assignments, and public feedback.
									</p>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
};

export default OfficerAnalyticsPage;
