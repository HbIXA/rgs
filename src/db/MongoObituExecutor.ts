import {MongoClient} from 'mongodb';
import {injectable} from 'inversify';
import * as config from '../config.json';

@injectable()
export default class MongoObituExecutor {
	private readonly connectionString: string;
	private readonly mongoOption: { useUnifiedTopology: boolean; useNewUrlParser: boolean };
	private db: string;
	private take: number;

	constructor() {
		this.connectionString = config.mongodb;
		this.mongoOption = {useNewUrlParser: true, useUnifiedTopology: true};
		this.db = 'obitu';
		this.take = 100;
	}

	connectAsync(): Promise<MongoClient> {
		const client = new MongoClient(this.connectionString, this.mongoOption);
		return client.connect();
	};

	async findOneAsync(collection: any, query: any) {
		const connect = await this.connectAsync();

		if (!connect) {
			return null;
		}

		const result = await connect
			.db(this.db)
			.collection(collection)
			.findOne(query);

		await connect.close();
		return result;
	}

	async insertOneAsync(collection: any, document: any): Promise<void> {
		const connect = await this.connectAsync();

		if (!connect) {
			return null;
		}

		await connect
			.db(this.db)
			.collection(collection)
			.insertOne(document);

		await connect.close();
		return null;
	}

}
