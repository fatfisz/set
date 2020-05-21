import { IteratorCallback, UpdateQuery } from 'mongodb';

import { db } from 'Database';
import { DatabaseSchema } from 'DatabaseSchema';

const sessionCollection = db.collection('session');

export async function forEach(
  callback: IteratorCallback<DatabaseSchema['session']>
) {
  await (await sessionCollection).find().forEach(callback);
}

export async function insertOne(data: DatabaseSchema['session']) {
  await (await sessionCollection).insertOne(data);
}

export async function updateOne(
  id: string,
  update: UpdateQuery<DatabaseSchema['session']>
) {
  await (await sessionCollection).updateOne({ id }, update);
}
