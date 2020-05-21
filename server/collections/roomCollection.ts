import { IteratorCallback, UpdateQuery } from 'mongodb';

import { db } from 'Database';
import { DatabaseSchema } from 'DatabaseSchema';

const roomCollection = db.collection('room');

export async function forEach(
  callback: IteratorCallback<DatabaseSchema['room']>
) {
  await (await roomCollection).find().forEach(callback);
}

export async function insertOne(data: DatabaseSchema['room']) {
  await (await roomCollection).insertOne(data);
}

export async function updateOne(
  id: string,
  update: UpdateQuery<DatabaseSchema['room']>
) {
  await (await roomCollection).updateOne({ id }, update);
}
