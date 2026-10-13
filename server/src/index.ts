import express, { Request, Response } from 'express';
import cors from 'cors';

import getDB from './database/database.js';
import { IContactNote } from './types.js';
import { formatText, normalizeDate } from './utils.js';

const app = express();
const db = getDB();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/students', (_req: Request, res: Response) => {
    try {
        const DANGER_WORDS = [
            'drop', 'struggle', 'struggling', 'missed', 'behind', 'late',
            'concern', 'stress', 'issue', 'risk', 'warning', 'probation',
            'reducing', 'anxiety', 'overwhelm', 'retake', 'retaking'
        ];

        const likeClauses = DANGER_WORDS.map(() => `LOWER(note_text) LIKE ?`).join(' OR ');
        const likeParams = DANGER_WORDS.map(word => `%${word}%`);

        const query = `
            WITH student_note_matches AS (
                SELECT
                    student_id,
                    SUM(
                        CASE
                            WHEN ${likeClauses} THEN 1
                            ELSE 0
                        END
                    ) as keyword_hits
                FROM contact_notes
                GROUP BY student_id
            )
            SELECT
                s.student_id,
                s.first_name,
                s.last_name,
                s.email,
                s.major,
                s.class_year,
                s.credits_earned,
                s.gpa,
                s.advisor,
                s.last_contact_date,
                s.risk_flag,
                (
                    CASE s.risk_flag WHEN 'High' THEN 40 WHEN 'Medium' THEN 20 ELSE 0 END
                    + CASE WHEN s.gpa < 2.5 THEN CAST((2.5 - s.gpa) * 20 AS INTEGER) ELSE 0 END
                    + CASE
                        WHEN s.last_contact_date IS NULL THEN 30
                        WHEN (julianday('2026-10-05') - julianday(s.last_contact_date)) > 30 THEN
                            MIN(CAST((julianday('2026-10-05') - julianday(s.last_contact_date)) - 30 AS INTEGER), 30)
                        ELSE 0
                      END
                    + MIN(COALESCE(nm.keyword_hits, 0) * 10, 30)
                ) AS priority_score
            FROM students s
            LEFT JOIN student_note_matches nm ON s.student_id = nm.student_id
            ORDER BY priority_score DESC;
        `;

        const students = db.prepare(query).all(...likeParams);
        res.json(students);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ status: 'error', message: 'DB query failed' });
    }
});

app.get('/api/students/:student_id/notes', (req: Request, res: Response) => {
    try {
        const notes = db.prepare('SELECT * FROM contact_notes WHERE student_id = ?').all(req.params.student_id) as IContactNote[];
        res.json(notes);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'DB query failed' });
    }
})

app.post('/api/students/:student_id/notes', (req: Request, res: Response) => {
    try {
        const { student_id } = req.params;
        const { note_text, advisor, contact_type, contact_date } = req.body;
        // NOTE: using uuid here instead of trying to match student ID. We would ideally like to know if those are
        // arbitrary values or an internal ID used by our CRM. For now assume arbitrary.
        const note_id = crypto.randomUUID();

        const normalizedDate = normalizeDate(contact_date);

        if (!normalizedDate || !note_text) {
            return res.status(400).json({ status: 'error', message: 'contact_date and note_text are required' });
        }
        const exists = db.prepare('SELECT 1 FROM students WHERE student_id = ?').get(student_id);
        if (!exists) {
            return res.status(404).json({ status: 'error', message: 'Student not found' });
        }

        const insertNote = db.prepare(`
            INSERT INTO contact_notes (note_id, student_id, contact_date, contact_type, advisor, note_text)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        `);

        const touchStudent = db.prepare(`
            UPDATE students
            SET last_contact_date = MAX(COALESCE(last_contact_date, ''), ?)
            WHERE student_id = ?
        `);

        const saveNote = db.transaction(({
            note_id, student_id, normalizedDate, contact_type, advisor, note_text
        }) => {
            const note = insertNote.get(
                note_id, student_id, normalizedDate, formatText(contact_type), advisor, note_text
            );
            touchStudent.run(normalizedDate, student_id);
            return note;
        });

        const note = saveNote({ note_id, student_id, normalizedDate, contact_type, advisor, note_text });

        res.json(note);
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'DB query failed' });
    }
})

app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
});
