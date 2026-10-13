import { useState, useEffect } from 'react';
import StudentList from './components/StudentList/StudentList';
import StudentDetails from './components/StudentDetails/StudentDetails';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';

import type { IStudent } from './types';

export function App() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [selectedStudent, setSelectedStudent] = useState<IStudent | undefined>();

    const fetchStudents = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

        fetch(`${apiUrl}/api/students`)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    throw new Error('Something went wrong')
                }
            })
            .then((data: IStudent[]) => {
                setStudents(data);
                setSelectedStudent(prev =>
                    prev ? data.find(s => s.student_id === prev.student_id) : undefined
                );
            })
            .catch((err) => setError(err.message));
    }

    useEffect(() => {
        fetchStudents();
    }, []);



    return (
        <>
            {error ? <ErrorBanner message={error} clearError={() => setError(undefined)} /> : null}
            <h1>Advisor Tracker</h1>
            {selectedStudent ?
                <StudentDetails
                    student={selectedStudent}
                    exitStudentDetails={() => { setSelectedStudent(undefined); }}
                    setError={setError}
                    onNewNote={() => { fetchStudents(); }} />
                : <StudentList students={students} setSelectedStudent={setSelectedStudent} />
            }
        </>
    )
}

export default App;
