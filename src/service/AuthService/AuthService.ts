import {inject, injectable} from 'inversify';
import UserDao from '../../dao/UserDao/UserDao';
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from './types';
import {RegisterStatusEnum} from "./enums";
import {BcryptHelper} from "../../helper/BcryptHelper";

@injectable()
export default class AuthService {
	@inject('UserDao') private userDao: UserDao;

	async register(req: RegisterRequest): Promise<RegisterResponse> {
		const {username: name, username, password} = req;

		const user = await this.userDao.findAsync({ username });

		if (user) {
			return { status: RegisterStatusEnum.userExist };
		}

		const hash = await BcryptHelper.hash(password);

		await this.userDao.registerAsync({
			name,
			username,
			hash,
			isApproved: false,
		});

		return {status: RegisterStatusEnum.registered}
	}

	async login(req: LoginRequest): Promise<LoginResponse> {
		const {username, password} = req;

		const user = await this.userDao.findAsync({
			username,
			isApproved: true
		});

		if (!user) {
			return null;
		}

		if (!await BcryptHelper.compare(password, user.hash)) {
			return null;
		}

		const response: LoginResponse = {
			name: user.name,
			username: user.username,
		};

		return response;
	}
}
