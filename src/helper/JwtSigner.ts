import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import { parse } from '@poppinss/cookie';
import * as config from '../config.json';

/*
 * Помощник с jwt-токен
 */
export default class JwtSigner {
	/*
	 * Шифрует объект в токен
	 */
	private static sign(payload: any): string {
		return jwt.sign(payload, config.jwt.secret);
	}

	/*
	 * Дешифрует токен в объект
	 */
	private static verify(token: string): object | string {
		try {
			return jwt.verify(token, config.jwt.secret);
		} catch (e) {
			return null;
		}
	}

	/*
	 * Достает jwt-токен из куки
	 */
	static getJwt(req: express.Request): object | string {
		const token = parse(req.headers.cookie, config.jwt.secret).signedCookies[config.jwt.name];

		if (!token) {
			return null;
		}

		return this.verify(token);
	}

	/*
	 * Выставляет jwt-токен в куки
	 */
	static setJwt(res: express.Response, payload: any): void {
		if (!payload) {
			res.clearCookie(config.jwt.name);
			return;
		}

		const token = this.sign(payload);

		res.cookie(config.jwt.name,
			token,
			{
			signed: true,
			secure: false, // set to true if your using https
			httpOnly: true
			});
		}
}
