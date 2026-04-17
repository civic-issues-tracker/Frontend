import { Bell, Search, TriangleAlert } from 'lucide-react';

const notifications = [
	{
		id: 'ALRT-901',
		title: 'High Priority Issue Escalated',
		description: 'ISS-4921 exceeded SLA in Bole North. Dispatch requested immediate field action.',
		time: '4 min ago',
		level: 'critical',
	},
	{
		id: 'ALRT-894',
		title: 'Citizen Follow-up Pending',
		description: 'Two unresolved comments on ISS-4918 require officer response.',
		time: '18 min ago',
		level: 'warning',
	},
	{
		id: 'ALRT-888',
		title: 'Unit Availability Updated',
		description: 'Unit 7 returned to patrol and is now available for reassignment.',
		time: '46 min ago',
		level: 'info',
	},
];

const OfficerAlertsPage = () => {
	return (
		<section>
			<header className="mb-3 flex items-start justify-between">
				<div>
					<h2 className="text-[36px] font-black leading-tight text-[#3E2B1F]">Notifications</h2>
					<p className="text-sm text-[#857060]">Live operational alerts, escalations, and response reminders.</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center rounded-full border border-[#DDCFC0] bg-[#F8F6F2] px-3 py-1.5">
						<Search size={14} className="mr-1 text-[#9D8A78]" />
						<input placeholder="Search notifications..." className="w-56 bg-transparent text-xs outline-none" />
					</div>
					<button className="rounded-full border border-[#DDCFC0] bg-[#F8F6F2] p-2 text-[#8B7B69]" title="More options" aria-label="More options">◯</button>
				</div>
			</header>

			<div className="min-h-[81vh] rounded-2xl border border-[#D8CCBD] bg-[#F6F2EC] p-4">
				<div className="mb-3 flex flex-wrap items-center gap-2">
					<button className="rounded-full bg-[#6A4834] px-3 py-1 text-xs font-semibold text-white">All</button>
					<button className="rounded-full border border-[#D8CCBD] bg-white px-3 py-1 text-xs text-[#6E5A49]">Critical</button>
					<button className="rounded-full border border-[#D8CCBD] bg-white px-3 py-1 text-xs text-[#6E5A49]">Warnings</button>
					<button className="rounded-full border border-[#D8CCBD] bg-white px-3 py-1 text-xs text-[#6E5A49]">Informational</button>
				</div>

				<div className="space-y-2">
					{notifications.map((item) => {
						const badgeClass = item.level === 'critical'
							? 'bg-[#FFE7E8] text-[#B62935]'
							: item.level === 'warning'
								? 'bg-[#FFF3DE] text-[#A16F12]'
								: 'bg-[#E5F4FF] text-[#22668F]';

						return (
							<div key={item.id} className="rounded-xl border border-[#DDD0C2] bg-white p-3">
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-start gap-2">
										<span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F1E6DA] text-[#6A4834]">
											{item.level === 'critical' ? <TriangleAlert size={14} /> : <Bell size={14} />}
										</span>
										<div>
											<p className="text-[11px] font-bold uppercase tracking-wider text-[#8B7868]">{item.id}</p>
											<h3 className="mt-1 text-sm font-bold text-[#3E2B1F]">{item.title}</h3>
											<p className="mt-1 text-sm text-[#6D5948]">{item.description}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-xs text-[#8A7767]">{item.time}</p>
										<span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${badgeClass}`}>
											{item.level}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default OfficerAlertsPage;
