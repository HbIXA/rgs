import * as express from 'express';
import {injectable} from 'inversify';
import {interfaces} from 'inversify-express-utils';
import Principal from './Principal';
import JwtSigner from '../helper/JwtSigner';

/*
 * Аутентифкационный провайдер.
 * Запускается на каждый запрос - считывает и расшифровывает jwt
 * и передает его в контекст в качестве объекта Principle
 */
@injectable()
export default class JwtAuthProvider implements interfaces.AuthProvider {
  public async getUser(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
  ): Promise<interfaces.Principal> {
    const detail = JwtSigner.getJwt(req);
    return new Principal(detail);
  }
}
