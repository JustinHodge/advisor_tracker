import { useState, useEffect } from 'react';
import type { IStudent, IContactNote } from '../../types';
import { getGPAClass, getLastContactDateClass, getPriorityClass, getRiskFlagClass } from '../../utils';

interface IProps {
    student: IStudent
    exitStudentDetails: () => void
    setError: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const StudentDetails = ({ student, exitStudentDetails, setError }: IProps) => {
    const [notes, setNotes] = useState<IContactNote[]>([]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

        fetch(`${apiUrl}/api/students/${student.student_id}/notes`)
            .then((res) => res.json())
            .then((data: IContactNote[]) => setNotes(data));
    }, [student])


    const handlAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (!formData.get('note_text') || !formData.get('contact_date') || !formData.get('advisor') || !formData.get('contact_type')) {
            setError('All fields are required');
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

        const response = await fetch(`${apiUrl}/api/students/${student.student_id}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                note_text: formData.get('note_text'),
                contact_date: formData.get('contact_date'),
                advisor: formData.get('advisor'),
                contact_type: formData.get('contact_type'),
            }),
        })

        const json = await response.json();

        if (!response.ok) {
            if (json.message) {
                setError(json.message);
            } else {
                setError('Something went wrong');
            }

            return;
        }

        setNotes([...notes, json]);

    }

    return (
        <>
            <h2>Student Details</h2>
            <p>Name: {student.first_name} {student.last_name}</p>
            <p>Priority Score: <span className={getPriorityClass(student.priority_score)}>{student.priority_score}</span></p>
            <p>Email: {student.email}</p>
            <p>Major: {student.major}</p>
            <p>Class Year: {student.class_year}</p>
            <p>Credits Earned: {student.credits_earned}</p>
            <p>GPA: <span className={getGPAClass(student.gpa ?? 0)}>{student.gpa}</span></p >
            <p>Advisor: {student.advisor}</p>
            <p>Last Contact Date: <span className={getLastContactDateClass(student.last_contact_date)}>{student.last_contact_date && student.last_contact_date.length ? student.last_contact_date : 'N/A'}</span></p>
            <p>Risk Flag: <span className={getRiskFlagClass(student.risk_flag)}>{student.risk_flag}</span></p>
            <p>Notes:</p>
            <table>
                <thead>
                    <tr>
                        <th>Advisor</th>
                        <th>Contact Type</th>
                        <th>Contact Date</th>
                        <th>Note Text</th>
                    </tr>
                </thead>
                <tbody>
                    {notes.map((note) => (
                        <tr key={note.note_id}>
                            <td>{note.advisor}</td>
                            <td>{note.contact_type}</td>
                            <td>{note.contact_date}</td>
                            <td>{note.note_text}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form onSubmit={handlAddNote}>
                <input type="text" id="note_text" name="note_text" placeholder="Enter a new note" />
                <input type="date" id="contact_date" name="contact_date" placeholder="Enter a contact date" defaultValue={new Date().toISOString().split('T')[0]} />
                <input type="text" id="advisor" name="advisor" placeholder="Enter an advisor" defaultValue={student.advisor ?? ''} />
                <input type="text" id="contact_type" name="contact_type" placeholder="Enter a contact type" />

                <button type="submit" >Add Note</button>
            </form >
            <button onClick={exitStudentDetails}>Back To List</button>
        </>
    )
}

export default StudentDetails
