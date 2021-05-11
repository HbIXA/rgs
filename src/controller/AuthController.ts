import * as express from 'express';
import {
	controller,
	httpGet,
	BaseHttpController, httpPost
} from 'inversify-express-utils';
import { inject } from 'inversify';
import AuthService, {LoginRequest, RegisterRequest, RegisterStatusEnum} from '../service/AuthService';
import JwtSigner from '../helper/JwtSigner';

/*
 * Аутентификация
 */
@controller('/auth')
export class AuthController extends BaseHttpController {
	@inject('AuthService') private authService: AuthService;

	@httpGet('/')
	private async index(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
		res.status(200).send('Hello');
	}

	@httpGet('/context')
	private async context(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
		res.status(200).send(this.httpContext.user);
	}

	@httpPost('/register')
	private async register(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
		const {username, password} = req.body;
		const request: RegisterRequest = {username, password};
		const response = await this.authService.register(request);

		if (response.status === RegisterStatusEnum.userExist) {
			res.status(403).send("Такой пользователь уже существует");
			return;
		}

		if (response.status === RegisterStatusEnum.registered) {
			res.status(200).send("Регистрация прошла успешно");
			return;
		}
	}

	@httpPost('/login')
	private async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
		const {username, password} = req.body;
		const request: LoginRequest = {username, password};
		const user = await this.authService.login(request);

		if (!user) {
			res.status(401).send(`Аутентификация не удалась`);
		}

		JwtSigner.setJwt(res, user);
		res.status(200).send(`{}`);
	}

	@httpPost('/logout')
	private async logout(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
		const {name = `неизвестный пользователь`} = this.httpContext.user.details || {};
		JwtSigner.setJwt(res, null);
		res.status(200).send(`пока, ${name}`);
	}
}
