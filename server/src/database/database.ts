import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { seedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../data.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const schemaFile = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaFile, 'utf-8');
db.exec(schema);

seedData(db);

const getDB = () => db;

export default getDB;
