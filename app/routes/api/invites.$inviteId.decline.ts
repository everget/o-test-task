import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';

export const Route = createAPIFileRoute('/api/invites/$inviteId/decline')({
	// Decline a received invite
	PATCH: ({ request, params }) => {
		db.data.invites = db.data.invites.map((invite) => {
			if (invite.id === params.inviteId && invite.status === 'pending') {
				invite.status = 'declined';
			}
			return invite;
		});

		return json({
			data: null,
			meta: {
				status: 200,
				message: 'Invite declined successfully',
			},
			errors: null,
		});
	},
});
