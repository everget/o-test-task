import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';

export const Route = createAPIFileRoute('/api/invites/$inviteId/accept')({
	GET: ({ request, params }) => {
		return json({ data: 'Hello /api/invites/$inviteId/accept' });
	},
});
