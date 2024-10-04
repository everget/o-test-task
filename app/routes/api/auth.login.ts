import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';

export const Route = createAPIFileRoute('/api/auth/login')({
	GET: ({ request, params }) => {
		return json({ data: 'Hello /api/auth/login' });
	},
	POST: async ({ request, params }) => {
		const formData = await request.formData();
		const existingUser = db.data.users.find((user) => user.email === formData.get('email'));
		if (!existingUser) {
			db.data.users.push({
				id: String(Date.now() / 1000),
				email: formData.get('email') as string,
				isVerified: false,
				hasInvite: false,
			});
		}
		console.log(db.data.users);
		return json({ data: null, errors: null });
	},
});
