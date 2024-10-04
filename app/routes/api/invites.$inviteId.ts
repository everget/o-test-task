import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { Invite } from '~/types';

export const Route = createAPIFileRoute('/api/invites/$inviteId')({
	// Retrieve details of a specific invite
	GET: ({ request, params }) => {
		return json({
			data: db.data.invites.find((invite: Invite) => invite.id === params.inviteId),
			meta: { status: 200 },
			errors: null,
		});
	},
	// Update an invite (e.g., modify permissions)
	PATCH: async ({ request, params }) => {
		const body = await request.json();
		const existingInvite = db.data.invites.find(
			(invite: Invite) => invite.id === params.inviteId
		);

		if (!existingInvite) {
			return json({
				data: null,
				meta: { status: 404, message: 'Invite not found' },
				errors: null,
			});
		}

		if (existingInvite.status === 'pending') {
			existingInvite.status = body.status;
		}
		existingInvite.permissions = body.permissions;

		return json({
			data: null,
			meta: { status: 200, message: 'Invite updated successfully' },
			errors: null,
		});
	},
	// Delete an invite
	DELETE: ({ request, params }) => {
		db.data.invites = db.data.invites.filter((invite: Invite) => invite.id !== params.inviteId);
		return json({
			data: null,
			meta: { status: 204, message: 'Invite deleted successfully' },
			errors: null,
		});
	},
});
