import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { Invite } from '~/types';

export const Route = createAPIFileRoute('/api/users/$userId/invites/received')({
	// Retrieve a list of invites received by the user
	GET: ({ request, params }) => {
		return json({
			data: db.data.invites.filter((invite: Invite) => invite.toUserId === params.userId),
		});
	},
});
