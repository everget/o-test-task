import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { useState } from 'react';
import {
	Button,
	Cell,
	Checkbox,
	Column,
	ComboBox,
	Dialog,
	DialogTrigger,
	Form,
	Heading,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	Modal,
	ModalOverlay,
	Popover,
	Row,
	Switch,
	Table,
	TableBody,
	TableHeader,
	TextField,
} from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { reducePermissions } from '~/lib/reduce-permissions';
import { Invite, Permission, User } from '~/types';
import { ChevronDownIcon } from './ChevronDownIcon';
import { ChevronUpIcon } from './ChevronUpIcon';
import { TrashIcon } from './TrashIcon';

const inviteSchema = z.object({
	email: z.string().email(),
	permissions: z.array(
		z.enum([
			'read_posts',
			'write_posts',
			'read_messages',
			'write_messages',
			'read_profile',
			'write_profile',
		])
	),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const fetchInvites = async ({ pageParam = 0 }) => {
	const response = await fetch(`/api/invites?page=${pageParam}`);
	return response.json();
};

const fetchUsers = async (query: string) => {
	const response = await fetch(`/api/users?search=${query}`);
	return response.json();
};

export function InvitesGiven({ userId }: { userId: string }) {
	const queryClient = useQueryClient();
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
	const [selectedUser, setSelectedUser] = useState(null);
	const [userQuery, setUserQuery] = useState('');

	const { data: invites } = useQuery({
		queryKey: ['invites', userId],
		queryFn: () => fetchInvites,
	});

	// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
	// 	queryKey: ['invitesGiven', userId],
	// 	queryFn: fetchInvites,
	// 	initialPageParam: 1,
	// 	getNextPageParam: (lastPage) => lastPage.nextCursor,
	// });

	const { data: users } = useQuery({
		queryKey: ['users', userQuery],
		queryFn: () => fetchUsers(userQuery),
		enabled: userQuery.length > 0,
	});

	const createInviteMutation = useMutation({
		mutationFn: (newInvite: Omit<Invite, 'id' | 'status'>) => {
			return fetch('/api/invites', {
				method: 'POST',
				body: JSON.stringify(newInvite),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invitesGiven', userId] });
		},
	});

	const deleteInviteMutation = useMutation({
		mutationFn: (inviteId: string) => {
			return fetch(`/api/invites/${inviteId}`, { method: 'DELETE' });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invitesGiven', userId] });
		},
	});

	const updatePermissionsMutation = useMutation({
		mutationFn: ({ inviteId, permissions }: { inviteId: string; permissions: string[] }) => {
			return fetch(`/api/invites/${inviteId}`, {
				method: 'PATCH',
				body: JSON.stringify({ permissions }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['invitesGiven', userId] });
		},
	});

	const toggleRowExpansion = (inviteId: string) => {
		setExpandedRows((prev) => ({ ...prev, [inviteId]: !prev[inviteId] }));
	};

	const handleDeleteInvite = (inviteId: string) => {
		deleteInviteMutation.mutate(inviteId);
	};

	const handlePermissionToggle = (inviteId: string, permission: string, isChecked: boolean) => {
		if (Array.isArray(invites)) {
			const invite = invites.find((inv) => inv.id === inviteId);
			if (invite) {
				const updatedPermissions = isChecked
					? [...invite.permissions, permission]
					: invite.permissions.filter((p: Permission) => p !== permission);
				// updatePermissionsMutation.mutate({ inviteId, permissions: updatedPermissions });
			}
		}
	};

	const { control, handleSubmit, reset } = useForm<InviteFormData>({
		defaultValues: {
			email: '',
			permissions: [],
		},
		resolver: zodResolver(inviteSchema),
	});

	const onSubmit = (data: InviteFormData) => {
		if (!selectedUser) {
			return;
		}

		createInviteMutation.mutate({
			fromUserId: userId,
			toUserId: (selectedUser as User).id,
			permissions: [], //data.permissions,
			createdAt: new Date(),
		});
		reset();
		setSelectedUser(null);
	};

	return (
		<div className='p-4'>
			<Heading level={1}>Invites Given</Heading>
			<div className='flex space-x-4'>
				<ComboBox
					className='flex-grow relative'
					inputValue={selectedUser || undefined}
					// onChange={setSelectedUser}
				>
					<Label className='sr-only'>Search for an user</Label>
					<div className='flex'>
						<Input
							className='w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
							placeholder='Search for an user'
							// onChange={(event) => setUserQuery(event.target.value)}
						/>
						<Button className='px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
							▼
						</Button>
					</div>
					<Popover className='w-full'>
						<ListBox className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{Array.isArray(users) &&
								users.map((user) => (
									<ListBoxItem
										key={user.id}
										id={user.id}
										className={({ isFocused, isSelected }) => `
                  cursor-default select-none relative py-2 pl-3 pr-9
                  ${isFocused ? 'bg-indigo-600 text-white' : 'text-gray-900'}
                  ${isSelected ? 'font-medium' : 'font-normal'}
                `}
									>
										{user.email}
									</ListBoxItem>
								))}
						</ListBox>
					</Popover>
				</ComboBox>

				<DialogTrigger>
					<Button
						className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out'
						isDisabled={!selectedUser}
					>
						Send Invite
					</Button>
					<ModalOverlay className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
						<Modal className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
							<Dialog>
								{({ close }) => (
									<Form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
										<h2 className='text-2xl font-bold text-gray-800 mb-4'>
											Invite User
										</h2>
										<Controller
											name='email'
											control={control}
											rules={{ required: true }}
											render={({ field }) => (
												<TextField {...field} className='w-full'>
													<Label className='block text-sm font-medium text-gray-700 mb-1'>
														Email
													</Label>
													<Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
												</TextField>
											)}
										/>
										<div className='space-y-4'>
											<h3 className='text-lg font-semibold text-gray-800'>
												Permissions
											</h3>
											{['posts', 'messages', 'profile'].map((category) => (
												<div key={category} className='space-y-2'>
													<h4 className='text-md font-medium text-gray-700'>
														{category}
													</h4>
													<Controller
														name={`permissions`}
														control={control}
														render={({ field }) => (
															<div className='flex space-x-4'>
																<Checkbox
																	isSelected={field.value?.includes(
																		`read_${category}` as Permission
																	)}
																	onChange={(isSelected) => {
																		// ... (checkbox logic)
																	}}
																	className='flex items-center'
																>
																	<span className='ml-2 text-sm text-gray-600'>
																		Read
																	</span>
																</Checkbox>
																<Checkbox
																	isSelected={field.value?.includes(
																		`write_${category}` as Permission
																	)}
																	onChange={(isSelected) => {
																		// ... (checkbox logic)
																	}}
																	className='flex items-center'
																>
																	<span className='ml-2 text-sm text-gray-600'>
																		Write
																	</span>
																</Checkbox>
															</div>
														)}
													/>
												</div>
											))}
										</div>
										<Button
											type='submit'
											onPress={close}
											className='w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out'
										>
											Invite
										</Button>
									</Form>
								)}
							</Dialog>
						</Modal>
					</ModalOverlay>
				</DialogTrigger>
			</div>

			<Table
				aria-label='Invites given'
				className='min-w-full bg-white border border-gray-300 mt-8 rounded-lg overflow-hidden'
			>
				<TableHeader>
					<Column
						isRowHeader={true}
						className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100'
					>
						Email
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
					{Array.isArray(invites) &&
						invites.map((invite: Invite) => (
							<React.Fragment key={invite.id}>
								<Row className='hover:bg-gray-50'>
									<Cell className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{invite.toUserId}
									</Cell>
									<Cell className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{JSON.stringify(reducePermissions(invite.permissions))}
									</Cell>
									<Cell
										className={clsx('px-6 py-4 whitespace-nowrap text-sm', {
											'text-yellow-600': invite.status === 'pending',
											'text-green-600': invite.status === 'accepted',
											'text-red-600': invite.status === 'declined',
										})}
									>
										{invite.status}
									</Cell>
									<Cell className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										<div className='flex space-x-2'>
											<Button
												onPress={() => toggleRowExpansion(invite.id)}
												className='p-1 rounded-full hover:bg-gray-200'
											>
												{expandedRows[invite.id] ? (
													<ChevronUpIcon />
												) : (
													<ChevronDownIcon />
												)}
											</Button>
											<Button
												onPress={() => handleDeleteInvite(invite.id)}
												className='p-1 rounded-full hover:bg-red-100'
											>
												<TrashIcon />
											</Button>
										</div>
									</Cell>
								</Row>
								{expandedRows[invite.id] && (
									<Row>
										<Cell className='px-6 py-4 bg-gray-50'>
											<div className='space-y-4'>
												<p className='text-sm text-gray-600'>
													Invite sent:{' '}
													{new Date(invite.createdAt).toLocaleString()}
												</p>
												<div className='grid grid-cols-2 gap-4'>
													{[
														'read_posts',
														'write_posts',
														'read_messages',
														'write_messages',
														'read_profile',
														'write_profile',
													].map((permission) => (
														<div
															key={permission}
															className='flex items-center justify-between'
														>
															<Switch
																isSelected={invite.permissions.includes(
																	permission as Permission
																)}
																onChange={(isSelected) =>
																	handlePermissionToggle(
																		invite.id,
																		permission,
																		isSelected
																	)
																}
															>
																{permission}
															</Switch>
														</div>
													))}
												</div>
											</div>
										</Cell>
									</Row>
								)}
							</React.Fragment>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
