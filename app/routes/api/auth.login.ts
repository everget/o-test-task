import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { generateUniqueId } from '~/lib/generate-unique-id';

export const Route = createAPIFileRoute('/api/auth/login')({
	GET: ({ request, params }) => {
		return json({ data: 'Hello /api/auth/login' });
	},
	POST: async ({ request, params }) => {
		const body = await request.json();
		const existingUser = db.data.users.find((user) => user.email === body.email);
		if (!existingUser) {
			db.data.users.push({
				id: generateUniqueId(),
				email: body.email as string,
				isVerified: false,
				hasInvite: false,
			});
		}

		return json({
			data: null,
			meta: { status: 200 },
			errors: null,
		});
	},
});
