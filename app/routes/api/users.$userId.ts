import { json } from '@tanstack/start';
import { createAPIFileRoute } from '@tanstack/start/api';
import { db } from '~/db';
import { User } from '~/types';

export const Route = createAPIFileRoute('/api/users/$userId')({
	// Retrieve a specific user's details
	GET: ({ request, params }) => {
		return json({
			data: db.data.users.find((user: User) => user.id === params.userId),
			meta: { status: 200 },
			errors: null,
		});
	},
	// Update a user's information
	// PATCH: ({ request, params }) => {
	//     const formData = new FormData(request);
	//     const existingUser = db.data.users.find((user: User) => user.id === params.userId);
	//     if (existingUser) {
	//         for (const [key, value] of formData.entries()) {
	//             existingUser[key] = value;
	//         }
	//         return json({
	//             data: null,
	//             meta: { status: 200 },
	//             errors: null,
	//         });
	//     }
	//     return json({
	//         data: null,
	//         meta: { status: 404 },
	//         errors: null,
	//     });
	// }
	// Delete a user
	DELETE: ({ request, params }) => {
		db.data.users = db.data.users.filter((user: User) => user.id !== params.userId);
		return json({
			data: null,
			meta: { status: 200 },
			errors: null,
		});
	},
});
