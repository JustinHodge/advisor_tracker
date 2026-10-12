PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS system_check (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
);

INSERT INTO system_check (message)
  SELECT 'Database created at ' || datetime('now', 'localtime')
  WHERE NOT EXISTS (SELECT 1 FROM system_check);

CREATE TABLE IF NOT EXISTS students (
  student_id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  major TEXT,
  class_year TEXT CHECK(class_year IN ('Freshman', 'Sophomore', 'Junior', 'Senior')),
  credits_earned INTEGER DEFAULT 0,
  gpa REAL,
  advisor TEXT,
  last_contact_date TEXT default NULL,
  risk_flag TEXT CHECK(risk_flag IN ('Low', 'Medium', 'High'))
);

CREATE TABLE IF NOT EXISTS contact_notes (
  note_id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  contact_date TEXT NOT NULL,
  contact_type TEXT CHECK (contact_type IN ('Email', 'Phone', 'Zoom', 'In person')),
  advisor TEXT,
  note_text TEXT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

