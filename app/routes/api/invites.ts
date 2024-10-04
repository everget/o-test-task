import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';

export const Route = createAPIFileRoute('/api/invites')({
	// All invites
	GET: ({ request, params }) => {
		return json({ data: db.data.invites, errors: null });
	},
	// Create a new invite
	POST: ({ request, params }) => {
		return json({ data: 'Hello /api/invites' });
	},
});
