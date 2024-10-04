import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { generateUniqueId } from '~/lib/generate-unique-id';

export const Route = createAPIFileRoute('/api/users')({
	// All users
	GET: ({ request, params }) => {
		return json({ data: db.data.users, meta: { status: 200 }, errors: null });
	},

	// Create a new user
	POST: async ({ request, params }) => {
		const body = await request.json();
		const existingUser = db.data.users.find((user) => user.email === body.email);
		if (existingUser) {
			return json({
				data: null,
				meta: { status: 400, message: 'User already exists' },
				errors: null,
			});
		}

		db.data.users.push({
			id: generateUniqueId(),
			email: body.email,
			isVerified: false,
			hasInvite: false,
		});

		return json({
			data: null,
			meta: { status: 201, message: 'User created successfully' },
			errors: null,
		});
	},
});
