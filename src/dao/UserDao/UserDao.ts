import {inject, injectable} from 'inversify';
import MongoObituExecutor from '../../db/MongoObituExecutor';
import {FindRequest, User} from './types';

@injectable()
export default class UserDao {
	@inject('MongoObituExecutor') private executor: MongoObituExecutor;

	async findAsync(query: FindRequest): Promise<User> {
		return this.executor.findOneAsync('user', query)
	}

	async registerAsync(query: User): Promise<void> {
		await this.executor.insertOneAsync('user', query);
	}
}
