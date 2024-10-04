import { Heading } from 'react-aria-components';
import { InvitesGiven } from './InvitesGiven';
import { InvitesReceived } from './InvitesReceived';

export function AccountManagement() {
	// const { user } = useAuth();

	// if (!user) {
	//     return null;
	// }
	const user = {
		id: '1',
	};

	return (
		<>
			<div className='flex justify-between'>
				<div className='mt-8'>
					<InvitesGiven userId={user.id} />
				</div>
				<div className='mt-8'>
					<Heading level={1}>Invites Received</Heading>
					<InvitesReceived userId={user.id} />
				</div>
			</div>
		</>
	);
}
