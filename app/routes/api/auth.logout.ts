import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';

export const Route = createAPIFileRoute('/api/auth/logout')({
	GET: ({ request, params }) => {
		return json({ data: 'Hello /api/auth/logout' });
	},
});
