import { Database } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

import { IStudent } from '../types.js';
import { IContactNote } from '../types.js';
import { normalizeDate } from '../utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedData = (db: Database) => {
    console.log('Seeding data...');

    const existing = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };

    if (existing.count > 0) {
        console.log('Database already seeded. Skipping.');
        return;
    }

    const studentsFilePath = path.resolve(__dirname, 'seeds/students.csv');
    const contactNotesFilePath = path.resolve(__dirname, 'seeds/contact_notes.csv');

    const studentsFile = fs.readFileSync(studentsFilePath, 'utf-8');
    const contactNotesFile = fs.readFileSync(contactNotesFilePath, 'utf-8');

    const students: IStudent[] = parse(studentsFile, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    const contactNotes: IContactNote[] = parse(contactNotesFile, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    const insertAll = db.transaction(() => {
        const insertStudent = db.prepare(`
            INSERT OR REPLACE INTO students (
                student_id, first_name, last_name, email, major,
                class_year, credits_earned, gpa, advisor, last_contact_date, risk_flag
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // NOTE: risk_flag is an arbitrary string. We need more information from the advising office on how this is
        // set and what it's importance is to better integrate it into our priority score.
        //
        for (const student of students) {
            insertStudent.run(
                student.student_id,
                student.first_name,
                student.last_name,
                student.email,
                student.major,
                student.class_year,
                student.credits_earned,
                student.gpa,
                student.advisor,
                normalizeDate(student.last_contact_date),
                student.risk_flag
            );
        }

        const insertNote = db.prepare(`
            INSERT OR REPLACE INTO contact_notes (
                note_id, student_id, contact_date, contact_type, advisor, note_text
            ) VALUES (?, ?, ?, ?, ?, ?)
        `);

        // TODO: Contact_type should be normalized out to it's own table and referenced by ID here instead of text
        // NOTE: the seed data can (and does) contain restricted data. This must be handled carefully. Notes should not
        // be used or accessible externally without heavy sanitization (e.g. N041 contains SSN).
        for (const contactNote of contactNotes) {
            insertNote.run(
                contactNote.note_id,
                contactNote.student_id,
                normalizeDate(contactNote.contact_date),
                contactNote.contact_type,
                contactNote.advisor,
                contactNote.note_text
            );
        }
    });

    try {
        insertAll();
        console.log(`Successfully seeded ${students.length} students and ${contactNotes.length} notes!`);
    } catch (err) {
        console.error('Error executing seed transaction:', err);
        throw err;
    }
};
