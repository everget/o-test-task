import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';

export const Route = createAPIFileRoute('/api/users')({
	// All users
	GET: ({ request, params }) => {
		return json({ data: db.data.users, errors: null });
	},

	// Create a new user
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
		return json({ data: null, errors: null });
	},
});
