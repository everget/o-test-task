import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
	Button,
	Cell,
	Column,
	Heading,
	Row,
	Table,
	TableBody,
	TableHeader,
} from 'react-aria-components';
import { reducePermissions } from '~/lib/reduce-permissions';
import { Invite, InviteStatus } from '~/types';

const fetchInvitesReceived = async ({ userId }: { userId: string }) => {
	const response = await fetch(`/api/users/${userId}/invites/received`);
	return response.json();
};

export function InvitesReceived({ userId }: { userId: string }) {
	const queryClient = useQueryClient();

	const { data: invites } = useQuery({
		queryKey: ['invitesReceived', userId],
		queryFn: () => fetchInvitesReceived({ userId }),
		staleTime: 1000 * 30,
	});

	const updateInviteMutation = useMutation({
		mutationFn: ({ inviteId, status }: { inviteId: string; status: InviteStatus }) => {
			return fetch(`/api/invites/${inviteId}`, {
				method: 'PATCH',
				body: JSON.stringify({ status }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invitesReceived', userId] });
		},
	});

	const handleInviteResponse = (inviteId: string, status: InviteStatus) => {
		updateInviteMutation.mutate({ inviteId, status });
	};

	return (
		<div className='p-4'>
			<Heading className='mb-4 text-md font-bold' level={1}>
				Invites Received
			</Heading>
			<Table
				aria-label='Invites received'
				className='min-w-full bg-white border border-gray-300 mt-8 rounded-lg overflow-hidden'
			>
				<TableHeader>
					<Column
						isRowHeader={true}
						className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100'
					>
						From Email
					</Column>
					<Column
						isRowHeader={true}
						className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100'
					>
						Permissions
					</Column>
					<Column
						isRowHeader={true}
						className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100'
					>
						Status
					</Column>
					<Column
						isRowHeader={true}
						className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100'
					>
						Actions
					</Column>
				</TableHeader>
				<TableBody>
					{invites &&
						Array.isArray(invites.data) &&
						invites.data.map((invite: Invite) => (
							<Row key={invite.id} className='hover:bg-gray-50'>
								<Cell className='px-6 py-4 whitespace-nowrap'>
									{invite.fromUserId}
								</Cell>
								<Cell className='px-6 py-4 whitespace-nowrap'>
									{invite.permissions &&
										JSON.stringify(reducePermissions(invite.permissions))}
								</Cell>
								<Cell
									className={clsx('px-6 py-4 whitespace-nowrap', {
										'text-yellow-600': invite.status === 'pending',
										'text-green-600': invite.status === 'accepted',
										'text-red-600': invite.status === 'declined',
									})}
								>
									{invite.status}
								</Cell>
								<Cell className='px-6 py-4 whitespace-nowrap'>
									{invite.status === 'pending' && (
										<>
											<Button
												className='mr-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out'
												onPress={() =>
													handleInviteResponse(invite.id, 'accepted')
												}
											>
												Accept
											</Button>
											<Button
												className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out'
												onPress={() =>
													handleInviteResponse(invite.id, 'declined')
												}
											>
												Decline
											</Button>
										</>
									)}
								</Cell>
							</Row>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
