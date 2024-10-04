import { Switch } from 'react-aria-components';
import { Permission } from '~/types';

export function PermissionSwitch({
	permission,
	isSelected,
	onChange,
}: {
	permission: Permission;
	isSelected: boolean;
	onChange: (isSelected: boolean) => void;
}) {
	return (
		<Switch
			className='group flex gap-2 items-center text-gray-700 font-semibold text-lg'
			isSelected={isSelected}
			onChange={onChange}
		>
			<div className='flex h-[26px] w-[44px] shrink-0 cursor-default rounded-full shadow-inner bg-clip-padding border border-solid border-white/30 p-[3px] box-border transition duration-200 ease-in-out bg-gray-300 group-pressed:bg-gray-400 group-selected:bg-indigo-600 group-selected:group-pressed:bg-indigo-700 outline-none group-focus-visible:ring-2 ring-indigo-300'>
				<span className='h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-200 ease-in-out translate-x-0 group-selected:translate-x-[100%]' />
			</div>
			{permission}
		</Switch>
	);
}
