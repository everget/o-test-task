import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';

export const Route = createAPIFileRoute('/api/auth/register')({
	GET: ({ request, params }) => {
		return json({
			data: null,
			meta: { status: 200 },
			errors: null,
		});
	},
});
