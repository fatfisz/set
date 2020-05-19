import { MongoClient } from 'mongodb';

import credentials from '../credentials.json';

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

  async collection(name: string) {
    return (await this.db).collection(name);
  }
}

export const db = new Database();
