import { User, Permission } from '~/types';
import { generateUniqueId } from './generate-unique-id';

export function generateRandomInvites(users: User[], allPermissions: Permission[], count: number) {
	const invites = [];

	for (let i = 0; i < count; i++) {
		const fromUser = users[Math.floor(Math.random() * users.length)];
		let toUser;
		do {
			toUser = users[Math.floor(Math.random() * users.length)];
		} while (toUser.id === fromUser.id);

		const permissions = allPermissions.filter(() => Math.random() < 0.5);

		const status = ['pending', 'accepted', 'declined'][Math.floor(Math.random() * 3)];

		const createdAt = new Date(
			Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
		); // Random date within last 30 days

		const invite = {
			id: generateUniqueId(),
			fromUserId: fromUser.id,
			toUserId: toUser.id,
			permissions,
			status,
			createdAt,
		};

		invites.push(invite);
	}

	return invites;
}
