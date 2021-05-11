export type FindRequest = {
	username: string,
	isApproved?: boolean
}

export type User = {
	name: string,
	username: string,
	hash: string,
	isApproved: boolean
}
