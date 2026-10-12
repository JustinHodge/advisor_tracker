import { useState, useEffect } from 'react';
import StudentList from './components/StudentList/StudentList';
import StudentDetails from './components/StudentDetails/StudentDetails';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';

import type { IStudent } from './types';

export function App() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [error, setError] = useState<string | undefined>();
    const [selectedStudent, setSelectedStudent] = useState<IStudent | undefined>();

    useEffect(() => {
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
            .then((data: IStudent[]) => { return setStudents(data) }).catch((err) => setError(err.message));
    }, []);



    return (
        <>
            {error ? <ErrorBanner message={error} clearError={() => setError(undefined)} /> : null}
            <h1>Advisor Tracker</h1>
            {selectedStudent ?
                <StudentDetails student={selectedStudent} exitStudentDetails={() => { setSelectedStudent(undefined); }} setError={setError} />
                : <StudentList students={students} setSelectedStudent={setSelectedStudent} />
            }
        </>
    )
}

export default App;
