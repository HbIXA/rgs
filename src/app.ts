import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors';
import 'reflect-metadata'
import { Container } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'
import * as config from './config.json'
import JwtAuthProvider from './auth/JwtAuthProvider'
// Контроллеры
import './controller/AuthController'
// Инверсия
import MongoObituExecutor from './db/MongoObituExecutor'
import UserDao from './dao/UserDao/UserDao'
import AuthService from './service/AuthService'
// Контейнеры
const container = new Container();
// 1
container.bind<MongoObituExecutor>('MongoObituExecutor').to(MongoObituExecutor);
// 2
container.bind<UserDao>('UserDao').to(UserDao);
// 3
container.bind<AuthService>('AuthService').to(AuthService);
// Сервер
const server = new InversifyExpressServer(
    container,
    null,
	null,
	null,
	JwtAuthProvider
);
server.setConfig(cf => {
	cf.use(bodyParser.urlencoded({ extended: true }));
	cf.use(bodyParser.json());
	cf.use(cookieParser(config.jwt.secret));
	cf.use(cors({origin: true, credentials: true}));

});
// Старт
const app = server.build();
app.listen(config.port);
