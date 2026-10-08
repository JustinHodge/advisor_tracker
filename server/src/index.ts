import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('data.db');
db.pragma('journal_mode = WAL');

// Quick health check table
db.exec(`
  CREATE TABLE IF NOT EXISTS system_check (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  );
  INSERT INTO system_check (message)
  SELECT 'Typed Hello World from SQLite!'
  WHERE NOT EXISTS (SELECT 1 FROM system_check);
`);

app.get('/api/health', (_req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT message FROM system_check WHERE id = 1').get() as { message: string } | undefined;
    res.json({
      status: 'ok',
      dbMessage: row?.message ?? 'No data found',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'DB query failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
