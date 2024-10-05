import { createFileRoute } from '@tanstack/react-router';
import { AccountManagement } from '~/components/AccountManagement';

export const Route = createFileRoute('/')({
	component: () => <AccountManagement />,
	loader: async ({ context: { queryClient } }) => {},
});
