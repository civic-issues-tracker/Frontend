import { useMemo, Suspense, lazy, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getOrganizationAdminWorkspace, updateTicketStatus, assignTicket } from '../organizationAdminWorkspace';

const LazyMap = lazy(() => import('../components/OrganizationAdminMap'));

const boleCenter: [number, number] = [8.9907, 38.7991];



const OrganizationAdminIssuesPage = () => {
	const { user } = useAuth();
	const seed = user?.email ?? user?.id ?? user?.full_name;
	const [refresh, setRefresh] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const workspace = useMemo(() => getOrganizationAdminWorkspace(seed), [seed, refresh]);

	const { showToast } = useAuth();

	const cycleTicketStatus = (ticketId: string) => {
		const ws = getOrganizationAdminWorkspace(seed);
		const ticket = ws.organizationAdminTickets.find((t) => t.id === ticketId);
		if (!ticket) return;
		const order: Array<'new' | 'in_progress' | 'resolved'> = ['new', 'in_progress', 'resolved'];
		const next = order[(order.indexOf(ticket.status) + 1) % order.length];
		updateTicketStatus(seed, ticketId, next);
		setRefresh((r) => r + 1);
		showToast(`Ticket ${ticketId} status -> ${next}`, 'success');
	};

	const assignTicketToUnit = (ticketId: string, unit = 'Unit 4') => {
		const updated = assignTicket(seed, ticketId, unit);
		if (updated) {
			setRefresh((r) => r + 1);
			showToast(`Assigned ${unit} to ${ticketId}`, 'success');
		} else showToast('Assign failed', 'error');
	};

	const tickets = workspace.organizationAdminTickets;
	const visibleTickets = tickets.filter((t) => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		return (t.id.toLowerCase().includes(q) || (t.location ?? '').toLowerCase().includes(q) || (t.title ?? '').toLowerCase().includes(q));
	});

	const boleSites = [
		{ ticket: visibleTickets[0] ?? tickets[0], name: 'Bole Medhanialem', lat: 8.9908, lng: 38.7915 },
		{ ticket: visibleTickets[1] ?? visibleTickets[0] ?? tickets[0], name: 'Edna Mall', lat: 8.9924, lng: 38.7896 },
		{ ticket: visibleTickets[2] ?? visibleTickets[0] ?? tickets[0], name: 'Bole Atlas', lat: 8.9961, lng: 38.7868 },
		{ ticket: visibleTickets[3] ?? visibleTickets[0] ?? tickets[0], name: 'Airport Road', lat: 8.9838, lng: 38.8034 },
	];
	return (
		<section>
			<header className="mb-3 flex items-start justify-between">
				<div>
					<h2 className="text-[42px] font-black leading-tight text-[#3E2B1F]">Bole Subcity Map</h2>
					<p className="text-sm text-[#857060]">Live location of reported issues in Bole, Addis Ababa.</p>
				</div>
					<div className="flex items-center gap-2">
					<div className="flex items-center rounded-full border border-[#DDCFC0] bg-[#F8F6F2] px-3 py-1.5">
						<Search size={14} className="mr-1 text-[#9D8A78]" />
						<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search ticket ID or address..." className="w-56 bg-transparent text-xs outline-none" />
					</div>
					<button type="button" onClick={() => setSearchQuery('')} className="rounded-full border border-[#DDCFC0] bg-[#F8F6F2] p-2 text-[#8B7B69]" aria-label="Clear search">
						<X size={14} />
					</button>
				</div>
			</header>

			<div className="relative min-h-[81vh] overflow-hidden rounded-4xl border border-[#D8CCBD] bg-[#DACEB8]">
							<div className="absolute inset-0 z-0">
					<Suspense fallback={<div className="h-full w-full bg-gray-100" />}>
						<LazyMap center={boleCenter} sites={boleSites} />
					</Suspense>
							</div>
				<div className="absolute inset-0 z-1 bg-linear-to-t from-[#DACEB8]/20 via-transparent to-[#DACEB8]/10 pointer-events-none" />

				<div className="absolute left-4 top-4 z-20 w-[320px] rounded-3xl border border-white/70 bg-white/95 p-4 shadow-[0_24px_60px_rgba(68,43,24,0.18)] backdrop-blur-md">
					<p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8F7B69]">Bole District Overview</p>
					<h3 className="mt-2 text-lg font-bold text-[#3A2A20]">Active units and live coverage</h3>
					<div className="mt-3 space-y-2 text-sm">
						<div className="flex items-center justify-between rounded-xl border border-[#E7DCCF] bg-[#F8F4EE] px-3 py-2">
							<span>Unit 4 (Edna Mall)</span>
							<span className="text-xs text-[#7E8A95]">2 mins away</span>
						</div>
						<div className="flex items-center justify-between rounded-xl border border-[#E7DCCF] bg-[#F8F4EE] px-3 py-2">
							<span>Unit 7</span>
							<span className="text-xs text-[#7E8A95]">Patrol (Bole)</span>
						</div>
					</div>
				</div>

				<div className="absolute right-4 top-4 z-20 w-55 rounded-3xl border border-white/70 bg-white/95 p-4 shadow-[0_24px_60px_rgba(68,43,24,0.18)] backdrop-blur-md">
					<p className="mb-2 text-[11px] font-bold uppercase text-[#7A6756]">Map Legend</p>
					<ul className="space-y-1 text-xs text-[#4F3A2A]">
						<li><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#EF4444]" /> High Priority Issue</li>
						<li><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#F59E0B]" /> Medium Priority Issue</li>
						<li><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#10B981]" /> Low Priority / Resolved</li>
					</ul>
				</div>

				<div className="absolute bottom-4 left-4 right-4 z-20 rounded-[1.6rem] border border-white/70 bg-white/96 p-4 shadow-[0_24px_60px_rgba(68,43,24,0.18)] backdrop-blur-md">
					<div className="mb-3 flex items-center justify-between">
						<h4 className="text-sm font-bold text-[#3A2A20]">Active Incident Feed</h4>
						<span className="rounded-full bg-[#F0E7DB] px-2 py-0.5 text-[10px] text-[#6E5A49]">4 Live</span>
					</div>
						<div className="grid grid-cols-4 gap-2 text-xs text-[#5E4A3A]">
							<div className="font-semibold">Ticket</div>
							<div className="font-semibold">Zone</div>
							<div className="font-semibold">Priority</div>
							<div className="font-semibold">Assigned Unit</div>
							{workspace.organizationAdminTickets.map((t) => (
								<>
									<div key={`${t.id}-id`}>{t.id}</div>
									<div key={`${t.id}-loc`}>{t.location}</div>
									<div key={`${t.id}-prio`} className={t.priority === 'high' ? 'text-[#C03E3E]' : t.priority === 'medium' ? 'text-[#AF7A1E]' : 'text-[#2E8D56]'}>
										{t.priority[0].toUpperCase() + t.priority.slice(1)}
									</div>
									<div key={`${t.id}-unit`}>
										<div>{(t as any).assignedUnit ?? 'Unassigned'}</div>
										<div className="mt-1 flex gap-2">
											<button onClick={() => cycleTicketStatus(t.id)} className="rounded-full border border-[#DCCFC1] px-2 py-0.5 text-xs">Cycle Status</button>
											<button onClick={() => assignTicketToUnit(t.id)} className="rounded-full border border-[#DCCFC1] px-2 py-0.5 text-xs">Assign Unit</button>
										</div>
									</div>
								</>
							))}
						</div>
				</div>
			</div>
		</section>
	);
};

export default OrganizationAdminIssuesPage;