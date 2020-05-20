import { MongoClient } from 'mongodb';

import credentials from '../credentials.json';
import { DatabaseSchema } from 'DatabaseSchema';

const url = 'mongodb://localhost:27017';

const dbName = 'set-game';

class Database {
  private db = this.getDb();

  async getDb() {
    const client = await MongoClient.connect(url, {
      authSource: dbName,
      auth: credentials,
      useUnifiedTopology: true,
    });
    return client.db(dbName);
  }

  async collection<CollectionName extends keyof DatabaseSchema>(
    name: CollectionName
  ) {
    return (await this.db).collection<DatabaseSchema[CollectionName]>(name);
  }
}

export const db = new Database();
