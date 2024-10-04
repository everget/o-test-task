import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { generateUniqueId } from '~/lib/generate-unique-id';

export const Route = createAPIFileRoute('/api/invites')({
	// All invites
	GET: ({ request, params }) => {
		return json({
			data: db.data.invites,
			meta: { status: 200 },
			errors: null,
		});
	},
	// Create a new invite
	POST: async ({ request, params }) => {
		const body = await request.json();
		db.data.invites.push({
			id: generateUniqueId(),
			fromUserId: body.userId,
			toUserId: body.toUserId,
			permissions: JSON.parse(body.permissions),
			status: 'pending',
			createdAt: new Date(),
		});

		return json({
			data: null,
			meta: { status: 201, message: 'Invite created successfully' },
			errors: null,
		});
	},
});
