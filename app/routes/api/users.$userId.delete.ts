import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';

export const Route = createAPIFileRoute('/api/users/$userId/delete')({
	GET: ({ request, params }) => {
		return json({ data: 'Hello /api/users/$userId/delete' });
	},
});
