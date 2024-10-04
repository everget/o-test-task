import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start';
import * as React from 'react';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';

import styles from '~/styles/index.css?url';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	meta: () => [
		{
			charSet: 'utf-8',
		},
		{
			name: 'viewport',
			content: 'width=device-width, initial-scale=1',
		},
		{
			title: 'TanStack App',
		},
	],
	links: () => [{ rel: 'stylesheet', href: styles }],
	errorComponent: (props) => {
		return (
			<RootDocument>
				<DefaultCatchBoundary {...props} />
			</RootDocument>
		);
	},
	notFoundComponent: () => <NotFound />,
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<Html>
			<Head>
				<Meta />
			</Head>
			<Body>
				{children}
				<ScrollRestoration />
				<TanStackRouterDevtools position='bottom-right' />
				<ReactQueryDevtools buttonPosition='bottom-left' />
				<Scripts />
			</Body>
		</Html>
	);
}
