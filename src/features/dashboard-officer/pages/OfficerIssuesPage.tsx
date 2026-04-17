import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../../hooks/useAuth';
import { buildOfficerWorkspace } from '../officerWorkspace';

const boleCenter: [number, number] = [8.9907, 38.7991];

const createPin = (color: string) =>
	L.divIcon({
		className: 'officer-map-pin',
		html: `
			<div style="display:flex;align-items:center;justify-content:center;">
				<div style="width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 8px 18px rgba(0,0,0,.18);"></div>
			</div>
		`,
		iconSize: [24, 24],
		iconAnchor: [12, 12],
	});

const OfficerIssuesPage = () => {
	const { user } = useAuth();
	const workspace = useMemo(
		() => buildOfficerWorkspace(user?.email ?? user?.id ?? user?.full_name),
		[user?.email, user?.id, user?.full_name],
	);

	const officerTickets = workspace.officerTickets;
	const boleSites = [
		{ ticket: officerTickets[0], name: 'Bole Medhanialem', lat: 8.9908, lng: 38.7915 },
		{ ticket: officerTickets[1] ?? officerTickets[0], name: 'Edna Mall', lat: 8.9924, lng: 38.7896 },
		{ ticket: officerTickets[2] ?? officerTickets[0], name: 'Bole Atlas', lat: 8.9961, lng: 38.7868 },
		{ ticket: officerTickets[3] ?? officerTickets[0], name: 'Airport Road', lat: 8.9838, lng: 38.8034 },
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
						<input placeholder="Search ticket ID or address..." className="w-56 bg-transparent text-xs outline-none" />
					</div>
					<button className="rounded-full border border-[#DDCFC0] bg-[#F8F6F2] p-2 text-[#8B7B69]">◯</button>
				</div>
			</header>

			<div className="relative min-h-[81vh] overflow-hidden rounded-4xl border border-[#D8CCBD] bg-[#DACEB8]">
				<div className="absolute inset-0 z-0">
					<MapContainer center={boleCenter} zoom={14} className="h-full w-full" scrollWheelZoom>
						<TileLayer
							url={import.meta.env.VITE_MAP_TILE_URL ?? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						{boleSites.map((site) => {
							const tone = site.ticket.priority === 'high' ? '#EF4444' : site.ticket.priority === 'medium' ? '#F59E0B' : '#10B981';
							return (
								<Marker key={site.ticket.id} position={[site.lat, site.lng]} icon={createPin(tone)}>
									<Popup>
										<div className="min-w-45">
											<p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A725F]">{site.name}</p>
											<h4 className="mt-1 text-sm font-bold text-[#3A2A20]">{site.ticket.id}</h4>
											<p className="mt-1 text-xs text-[#5E4A3A]">{site.ticket.title}</p>
											<p className="mt-2 text-[11px] font-semibold text-[#8A725F]">Priority: {site.ticket.priority}</p>
										</div>
									</Popup>
								</Marker>
							);
						})}
					</MapContainer>
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
						<div>ISS-4921</div><div>North Ave</div><div className="text-[#C03E3E]">High</div><div>Unit 4</div>
						<div>ISS-4918</div><div>South Park</div><div className="text-[#AF7A1E]">Medium</div><div>Unit 7</div>
						<div>ISS-4915</div><div>5th & Elm</div><div className="text-[#AF7A1E]">Medium</div><div>Pending</div>
						<div>ISS-4902</div><div>West Blvd</div><div className="text-[#2E8D56]">Low</div><div>Crew 3</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OfficerIssuesPage;
