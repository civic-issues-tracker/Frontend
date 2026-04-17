import { chatThreads, officerTickets, resolvedTickets, type OfficerConversation, type OfficerTicket } from './officerMockData';

export interface OfficerWorkspace {
	seed: string;
	displayName: string;
	officerTickets: OfficerTicket[];
	resolvedTickets: OfficerTicket[];
	chatThreads: OfficerConversation[];
	departmentLabel: string;
}

const rotateList = <T,>(items: T[], shift: number): T[] => {
	if (items.length === 0) return [];
	const offset = ((shift % items.length) + items.length) % items.length;
	return [...items.slice(offset), ...items.slice(0, offset)];
};

const hashSeed = (value: string) => {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
	}
	return hash;
};

const sliceCount = (base: number, available: number, seed: number) => {
	if (available <= base) return available;
	return Math.min(available, base + (seed % Math.max(1, available - base + 1)));
};

export const buildOfficerWorkspace = (seedValue?: string | null): OfficerWorkspace => {
	const seed = seedValue?.trim() || 'officer-default';
	const seedHash = hashSeed(seed);
	const ticketCount = sliceCount(2, officerTickets.length, seedHash % officerTickets.length);
	const resolvedCount = sliceCount(4, resolvedTickets.length, (seedHash >> 2) % resolvedTickets.length);
	const threadCount = sliceCount(3, chatThreads.length, (seedHash >> 3) % chatThreads.length);

	return {
		seed,
		displayName: seed,
		departmentLabel: 'Bole Operations',
		officerTickets: rotateList(officerTickets, seedHash).slice(0, ticketCount),
		resolvedTickets: rotateList(resolvedTickets, seedHash >> 1).slice(0, resolvedCount),
		chatThreads: rotateList(chatThreads, seedHash >> 2).slice(0, threadCount),
	};
};
