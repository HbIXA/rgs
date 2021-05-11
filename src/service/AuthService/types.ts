import {RegisterStatusEnum} from './enums';

export type LoginRequest = {
	username: string;
	password: string;
};

export type LoginResponse = {
	name: string;
	username: string;
};

export type RegisterRequest = {
	username: string,
	password: string
}

export type RegisterResponse = {
	status: RegisterStatusEnum
}
