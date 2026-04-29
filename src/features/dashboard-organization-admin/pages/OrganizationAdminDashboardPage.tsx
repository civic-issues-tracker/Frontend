import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, MapPin, MoreHorizontal, MoreVertical, Search, Send, TriangleAlert } from 'lucide-react';
import { type OrganizationAdminTicket } from '../organizationAdminMockData';
import {
	getOrganizationAdminWorkspace,
	updateTicketStatus,
	assignTicket,
} from '../organizationAdminWorkspace';
import { useAuth } from '../../../hooks/useAuth';

const priorityTone: Record<string, string> = {
	high: 'text-[#C03E3E]',
	medium: 'text-[#AF7A1E]',
	low: 'text-[#2E8D56]',
};

const statusTone: Record<string, string> = {
	new: 'bg-[#FFE9EA] text-[#D63945]',
	in_progress: 'bg-[#FFF4D8] text-[#9A6F16]',
	resolved: 'bg-[#DCF5E4] text-[#20844A]',
};

const weekly = [
	{ day: 'Mon', heightClass: 'h-12' },
	{ day: 'Tue', heightClass: 'h-8' },
	{ day: 'Wed', heightClass: 'h-16' },
	{ day: 'Thu', heightClass: 'h-10' },
	{ day: 'Fri', heightClass: 'h-20' },
	{ day: 'Sat', heightClass: 'h-6' },
	{ day: 'Sun', heightClass: 'h-2' },
];

const OrganizationAdminDashboardPage = () => {
	const { user, showToast } = useAuth();
	const navigate = useNavigate();
	const seed = user?.email ?? user?.id ?? user?.full_name;
	const [searchQuery, setSearchQuery] = useState('');
	const workspace = useMemo(() => getOrganizationAdminWorkspace(seed), [seed]);

	const filteredTickets = workspace.organizationAdminTickets.filter((t) => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return true;
		return (
			t.id.toLowerCase().includes(q) ||
			(t.location ?? '').toLowerCase().includes(q) ||
			(t.title ?? '').toLowerCase().includes(q)
		);
	});
	const [selectedId, setSelectedId] = useState(() => workspace.organizationAdminTickets[0]?.id ?? '');
	const [note, setNote] = useState('');
	const [statusMap, setStatusMap] = useState<Record<string, OrganizationAdminTicket['status']>>(() =>
		Object.fromEntries(workspace.organizationAdminTickets.map((ticket) => [ticket.id, ticket.status])),
	);

	const selected = useMemo(
		() => workspace.organizationAdminTickets.find((ticket) => ticket.id === selectedId) ?? workspace.organizationAdminTickets[0],
		[selectedId, workspace.organizationAdminTickets],
	);
	const selectedStatus = statusMap[selected.id] ?? selected.status;

	const statusLabel =
		selectedStatus === 'new' ? 'New' : selectedStatus === 'in_progress' ? 'In Progress' : 'Resolved';

	const cycleStatus = () => {
		const order: OrganizationAdminTicket['status'][] = ['new', 'in_progress', 'resolved'];
		setStatusMap((prev) => {
			const current = prev[selected.id] ?? selected.status;
			const next = order[(order.indexOf(current) + 1) % order.length];
			updateTicketStatus(seed, selected.id, next);
			showToast(`Status updated to ${next.replace('_', ' ')} for ${selected.id}.`, 'success');
			return { ...prev, [selected.id]: next };
		});
	};

	const openDirections = () => {
		navigate('/organization-admin/map');
		showToast(`Opened the Bole map for ${selected.id}.`, 'success');
	};

	const assignCrew = () => {
		const unit = 'Unit 4';
		const updated = assignTicket(seed, selected.id, unit);
		if (updated) {
			showToast(`Assigned ${unit} to ${selected.id}.`, 'success');
			setStatusMap((prev) => ({ ...prev }));
		} else {
			showToast('Could not assign unit.', 'error');
		}
	};

	const requestEquipment = () => {
		showToast(`Equipment request queued for ${selected.id}.`, 'success');
	};

	const sendPublicReply = () => {
		if (!note.trim()) return;
		showToast(`Public reply prepared for ${selected.id}.`, 'success');
		setNote('');
	};

	return (
		<section>
			<header className="mb-3 flex items-start justify-between gap-3">
				<div>
					<h2 className="text-[56px] font-black leading-[0.95] text-[#3E2B1F]">Issue Queue</h2>
					<p className="text-sm text-[#857060]">Review, update, and dispatch assigned civic issues.</p>
					<p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08E6A]">
						Assigned to {user?.full_name || workspace.displayName} • {workspace.departmentLabel}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center rounded-full border border-[#DDCFC0] bg-[#F8F6F2] px-3 py-1.5">
						<Search size={14} className="mr-1 text-[#9D8A78]" />
						<input
							placeholder="Search ticket ID or address..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-56 bg-transparent text-xs outline-none"
						/>
					</div>
					<button type="button" className="rounded-full border border-[#DDCFC0] bg-[#F8F6F2] p-2 text-[#8B7B69]" aria-label="More options">
						<MoreHorizontal size={14} />
					</button>
				</div>
			</header>

			<div className="grid grid-cols-12 gap-3">
				<div className="col-span-12 space-y-3 xl:col-span-5">
					<div className="rounded-2xl border border-[#DFD3C5] bg-[#F9F6F2] p-3">
						<div className="mb-2 flex items-center justify-between">
							<h3 className="text-sm font-semibold text-[#4A3628]">My Weekly Performance</h3>
							<BarChart3 size={16} className="text-[#B19E8B]" />
						</div>
						<div className="grid grid-cols-7 items-end gap-2">
							{weekly.map((item) => (
								<div key={item.day} className="text-center">
									<div className={`mx-auto w-3 rounded-sm bg-[#B08E6A] ${item.heightClass}`} />
									<p className="mt-1 text-[10px] text-[#9D8A78]">{item.day}</p>
								</div>
							))}
						</div>
					</div>

					<div className="min-h-[72vh] rounded-2xl border border-[#DFD3C5] bg-[#F9F6F2] p-3">
						<div className="mb-2 flex items-center justify-between">
							<h3 className="text-lg font-bold text-[#4A3628]">Assigned Tickets</h3>
							<span className="rounded-full bg-[#E9DED2] px-2 py-0.5 text-xs text-[#705A47]">{filteredTickets.length} Total</span>
						</div>
						<div className="space-y-2">
							{filteredTickets.map((ticket) => (
								<button
									type="button"
									key={ticket.id}
									onClick={() => setSelectedId(ticket.id)}
									className={`w-full rounded-xl border bg-white p-3 text-left transition ${
										selected.id === ticket.id
											? 'border-[#C9A78A] shadow-[0_0_0_1px_#d4b296]'
											: 'border-[#E4D8CA] hover:border-[#d8c4b0]'
									}`}
								>
									<div className="mb-1 flex items-center justify-between">
										<p className="text-xs font-bold text-[#7A6655]">{ticket.id}</p>
										<span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusTone[ticket.status]}`}>
											{ticket.status === 'in_progress' ? 'In Progress' : ticket.status}
										</span>
									</div>
									<h4 className="text-sm font-semibold text-[#362518]">{ticket.title}</h4>
									<p className="mt-1 text-xs text-[#8A7767]">{ticket.location}</p>
									<div className="mt-2 flex items-center justify-between border-t border-[#EFE5DB] pt-2 text-[11px]">
										<p className={priorityTone[ticket.priority]}>
											<TriangleAlert size={12} className="mr-1 inline" />
											{ticket.priority[0].toUpperCase() + ticket.priority.slice(1)} Priority
										</p>
										<span className="text-[#B2A08F]">{ticket.timeAgo}</span>
									</div>
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="col-span-12 flex min-h-[72vh] flex-col rounded-2xl border border-[#DFD3C5] bg-[#F9F6F2] p-3 xl:col-span-7">
					<div className="mb-3 flex items-center justify-between border-b border-[#E7DACD] pb-2">
						<div className="flex items-center gap-2">
							<span className="text-xl font-black text-[#4A3628]">{selected.id}</span>
							<span className="rounded-full bg-[#E9E7E2] px-2 py-0.5 text-[11px] font-semibold text-[#617083]">{selected.category}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-[#8E7E6D]">
							<button onClick={cycleStatus} className="rounded-full border border-[#E0D3C5] px-2 py-1">
								Status: {statusLabel}
							</button>
							<MoreVertical size={16} />
						</div>
					</div>

					<h3 className="mb-2 text-[62px] font-extrabold leading-[0.92] text-[#2E2016]">{selected.title}</h3>
					<p className="mb-3 rounded-xl border border-[#E7DBCF] bg-[#F2EBE2] p-3 text-sm text-[#624F3E]">"{selected.summary}"</p>

					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<div className="overflow-hidden rounded-xl border border-[#E2D6C9] bg-[#D9CFC0]">
							<img
								src="https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&w=1200&q=80"
								alt="Road issue"
								className="h-40 w-full object-cover"
							/>
						</div>

						<div className="rounded-xl border border-[#E2D6C9] bg-[#EFE7DD] p-4 text-center">
							<MapPin className="mx-auto text-[#7C624D]" size={22} />
							<p className="mt-2 font-semibold text-[#5A4737]">{selected.location}</p>
							<p className="text-xs text-[#9D8A78]">Lat: {selected.lat}, Lng: {selected.lng}</p>
							<button onClick={openDirections} className="mt-3 rounded-full border border-[#DCCDBE] bg-[#F9F6F2] px-4 py-1 text-xs font-semibold text-[#6D5A48]">
								Get Directions
							</button>
						</div>

						<div className="rounded-xl border border-[#E2D6C9] bg-[#F8F3ED] p-3">
							<h4 className="mb-1 text-sm font-semibold text-[#4B392B]">Reporter Info</h4>
							<p className="text-sm font-semibold text-[#3E2D20]">{selected.reporter}</p>
							<p className="text-xs text-[#8E7B6A]">{selected.reporterPhone}</p>
						</div>

						<div className="rounded-xl border border-[#E2D6C9] bg-[#F8F3ED] p-3">
							<h4 className="mb-1 text-sm font-semibold text-[#4B392B]">Dispatch Actions</h4>
							<div className="flex gap-2 text-xs">
								<button onClick={assignCrew} className="rounded-full border border-[#DCCDBE] px-3 py-1">Assign Crew</button>
								<button onClick={requestEquipment} className="rounded-full border border-[#DCCDBE] px-3 py-1">Request Equipment</button>
							</div>
						</div>
					</div>

					<div className="mt-auto flex items-center gap-2 rounded-xl border border-[#E0D4C7] bg-[#F8F3ED] p-2">
						<input
							placeholder="Type an internal note or message to the citizen..."
							value={note}
							onChange={(e) => setNote(e.target.value)}
							className="flex-1 bg-transparent px-2 text-sm outline-none"
						/>
						<button
							className="rounded-full bg-[#6A4834] p-2 text-white disabled:opacity-40"
							disabled={!note.trim()}
							onClick={() => setNote('')}
							title="Send note"
							aria-label="Send note"
						>
							<Send size={14} />
						</button>
						<button onClick={sendPublicReply} className="rounded-lg border border-[#DFD2C4] px-3 py-1 text-xs">Public reply</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OrganizationAdminDashboardPage;