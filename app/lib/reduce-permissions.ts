import { Permission, PermissionSummary } from "~/types";

export function reducePermissions(permissions: Permission[]): PermissionSummary {
	const initialSummary: PermissionSummary = {
		posts: '',
		messages: '',
		profile: '',
	};

	return permissions.reduce((acc, permission) => {
		const [action, category] = permission.split('_');
		const letter = action === 'read' ? 'r' : 'w';

		if (category in acc) {
			if (!acc[category as keyof PermissionSummary].includes(letter)) {
				acc[category as keyof PermissionSummary] += letter;
			}
		}

		return acc;
	}, initialSummary);
}