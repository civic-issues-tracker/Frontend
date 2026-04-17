import { useMemo, useState } from 'react';
import { Phone, Search, Send } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { buildOfficerWorkspace } from '../officerWorkspace';

const getThreadSourceLabel = (threadId: string) => {
	if (threadId === 'dispatch') return 'Dispatch / Admin';
	if (threadId === 'city-alerts') return 'City Hall Alerts';
	return 'Reporter follow-up';
};

const OfficerNotificationsPage = () => {
	const { user, showToast } = useAuth();
	const workspace = useMemo(
		() => buildOfficerWorkspace(user?.email ?? user?.id ?? user?.full_name),
		[user?.email, user?.id, user?.full_name],
	);
	const [activeThreadId, setActiveThreadId] = useState(workspace.chatThreads[0]?.id ?? '');
	const [messageText, setMessageText] = useState('');
	const [localMessages, setLocalMessages] = useState<Record<string, { id: string; from: 'dispatch' | 'officer'; text: string; at: string }[]>>({});

	const activeThread = useMemo(
		() => workspace.chatThreads.find((thread) => thread.id === activeThreadId) ?? workspace.chatThreads[0],
		[activeThreadId, workspace.chatThreads],
	);

	const messages = localMessages[activeThread.id] ?? activeThread.messages;

	const sendMessage = () => {
		if (!messageText.trim()) return;
		const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		setLocalMessages((prev) => ({
			...prev,
			[activeThread.id]: [
				...(prev[activeThread.id] ?? activeThread.messages),
				{ id: `local-${Date.now()}`, from: 'officer', text: messageText.trim(), at: time },
			],
		}));
		setMessageText('');
		showToast('Message saved locally. Hook this thread to the backend conversation API when ready.', 'success');
	};

	return (
		<section>
			<header className="mb-3 flex items-start justify-between">
				<div>
					<h2 className="text-[42px] font-black leading-tight text-[#3E2B1F]">Message Center</h2>
					<p className="text-sm text-[#857060]">Communicate with citizens and dispatch centers.</p>
					<p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B08E6A]">
						Seeded for {user?.full_name || workspace.displayName} • {workspace.departmentLabel}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center rounded-full border border-[#DDCFC0] bg-[#F8F6F2] px-3 py-1.5">
						<Search size={14} className="mr-1 text-[#9D8A78]" />
						<input placeholder="Search ticket ID or address..." className="w-56 bg-transparent text-xs outline-none" />
					</div>
					<button className="rounded-full border border-[#DDCFC0] bg-[#F8F6F2] p-2 text-[#8B7B69]">◯</button>
				</div>
			</header>

			<div className="grid min-h-[81vh] grid-cols-1 gap-3 rounded-2xl border border-[#D8CCBD] bg-[#F6F2EC] p-3 xl:grid-cols-12">
				<aside className="rounded-xl border border-[#DDD0C2] bg-[#F8F4EE] p-3 xl:col-span-4">
					<h3 className="mb-2 text-lg font-bold text-[#3D2A1E]">Conversations</h3>
					<div className="mb-2 rounded-full border border-[#E1D4C6] bg-white px-3 py-1.5 text-xs text-[#907D6D]">Search messages...</div>
					<div className="space-y-1">
						{workspace.chatThreads.map((thread) => (
							<button
								key={thread.name}
								onClick={() => setActiveThreadId(thread.id)}
								className={`w-full rounded-lg border p-2 text-left ${
									activeThreadId === thread.id ? 'border-[#BAA592] bg-white' : 'border-transparent hover:bg-white/80'
								}`}
							>
								<div className="mb-1 flex items-center justify-between text-xs">
									<span className="font-semibold text-[#3A2B20]">{thread.name}</span>
									<span className="text-[#8B7868]">{thread.time}</span>
								</div>
								<div className="flex items-center justify-between">
									<p className="text-xs text-[#786453]">{thread.preview}</p>
									{thread.unread > 0 ? (
										<span className="ml-2 rounded-full bg-[#6A4834] px-2 py-0.5 text-[10px] text-white">{thread.unread}</span>
									) : null}
								</div>
							</button>
						))}
					</div>
				</aside>

				<div className="rounded-xl border border-[#DDD0C2] bg-white xl:col-span-8">
					<div className="flex items-center justify-between border-b border-[#E9DCD0] p-3">
						<div className="flex items-center gap-2">
							<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#5E4331] text-sm font-bold text-white">D</span>
							<div>
								<h4 className="font-semibold text-[#3A2A1E]">{activeThread.name}</h4>
								<p className="text-[11px] text-[#2F9F55]">{activeThread.online ? 'ONLINE' : 'ACTIVE'}</p>
								<p className="text-[10px] uppercase tracking-[0.24em] text-[#8C7867]">Source: {getThreadSourceLabel(activeThread.id)}</p>
							</div>
						</div>
						<div className="flex items-center gap-3 text-[#8D7A69]">
							<Phone size={15} />
							<span>⋮</span>
						</div>
					</div>

					<div className="space-y-3 p-4 text-sm">
						<div className="mx-auto w-fit rounded-full bg-[#ECE2D6] px-3 py-1 text-xs text-[#725E4D]">Today</div>

						{messages.map((message) => (
							<div key={message.id} className={message.from === 'officer' ? 'ml-auto max-w-[70%]' : 'max-w-[70%]'}>
								<div
									className={
										message.from === 'officer'
											? 'rounded-2xl bg-[#6A4834] p-3 text-[#FFF6EC]'
											: 'rounded-2xl border border-[#E8DBCF] bg-[#F8F2EA] p-3 text-[#4B3A2D]'
									}
								>
									{message.text}
								</div>
								<p className={`mt-1 text-xs text-[#978473] ${message.from === 'officer' ? 'text-right' : ''}`}>{message.at}</p>
							</div>
						))}
					</div>

					<div className="mt-6 flex items-center gap-2 border-t border-[#E9DCD0] p-3">
						<input
							placeholder="Type a message to Dispatch..."
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') sendMessage();
							}}
							className="flex-1 rounded-full border border-[#E1D4C6] bg-[#F7F2EB] px-4 py-2 text-sm outline-none"
						/>
						<button
							className="rounded-full bg-[#6A4834] p-2 text-white disabled:opacity-40"
							onClick={sendMessage}
							disabled={!messageText.trim()}
							title="Send message"
							aria-label="Send message"
						>
							<Send size={14} />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OfficerNotificationsPage;
