import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { Invite } from '~/types';

export const Route = createAPIFileRoute('/api/users/$userId/invites/given')({
	GET: ({ request, params }) => {
		return json({
			data: db.data.invites.filter((invite: Invite) => params.userId === invite.fromUserId),
		});
	},
});
