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
			<div className='flex flex-col'>
				<div className='mt-8'>
					<InvitesGiven userId={user.id} />
				</div>
				<div className='mt-8'>
					<InvitesReceived userId={user.id} />
				</div>
			</div>
		</>
	);
}
