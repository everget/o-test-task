// for permissions 011101
export type BinaryDigit = '0' | '1';
export type BinaryString =
	`${BinaryDigit}${BinaryDigit}${BinaryDigit}${BinaryDigit}${BinaryDigit}${BinaryDigit}`;

export type Permission =
	| 'read_posts'
	| 'write_posts'
	| 'read_messages'
	| 'write_messages'
	| 'read_profile'
	| 'write_profile';

export interface PermissionSummary {
	posts: string;
	messages: string;
	profile: string;
}

export interface User {
	id: string;
	email: string;
	isVerified: boolean;
	hasInvite: boolean;
}

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface Invite {
	id: string;
	fromUserId: string;
	toUserId: string;
	permissions: Permission[];
	status: InviteStatus;
	createdAt: Date;
}

export interface ApiResponse<T> {
	data: T | null;
	meta: {
		status: number;
		message: string;
	};
	errors: ApiError[] | null;
	pagination?: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
	};
}

interface ApiError {
	code: string;
	message: string;
	field?: string;
}
