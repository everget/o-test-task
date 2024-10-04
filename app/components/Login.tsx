import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Button, Form, Heading, Input, Label, TextField } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
	const { control, handleSubmit } = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: async (data: LoginFormData) => {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Login failed');
			}
			return response.json();
		},
		onSuccess: () => {
			navigate({ to: '/' });
		},
	});

	const onSubmit = (data: LoginFormData) => {
		loginMutation.mutate(data);
	};

	return (
		<div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
			<Heading level={1} className='text-2xl font-bold text-gray-800 mb-6'>
				Login
			</Heading>
			<Form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<Controller
					name='email'
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextField {...field} className='space-y-2'>
							<Label className='block text-sm font-medium text-gray-700'>Email</Label>
							<Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500' />
						</TextField>
					)}
				/>
				<Controller
					name='password'
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextField {...field} type='password' className='space-y-2'>
							<Label className='block text-sm font-medium text-gray-700'>
								Password
							</Label>
							<Input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500' />
						</TextField>
					)}
				/>
				<Button
					type='submit'
					isDisabled={loginMutation.isPending}
					className='w-full px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{loginMutation.isPending ? 'Logging in...' : 'Login'}
				</Button>
			</Form>
		</div>
	);
}
