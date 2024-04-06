import { drizzle } from 'drizzle-orm/mysql2';

import mysql from 'mysql2/promise';

import * as schema from './schema';

import dbConfig from './drizzle.config';

Object.assign(dbConfig.dbCredentials, { multipleStatements: true });

export const connection = await mysql.createConnection(dbConfig.dbCredentials);

export const db = drizzle(connection, { schema, mode: 'default' });
