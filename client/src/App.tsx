import { useState, useEffect } from 'react';
import StudentList from './components/StudentList/StudentList';
import StudentDetails from './components/StudentDetails/StudentDetails';

import type { IStudent } from './types';

export function App() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<IStudent | undefined>();

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

        fetch(`${apiUrl}/api/students`)
            .then((res) => res.json())
            .then((data: IStudent[]) => setStudents(data));
    }, []);

    console.log(students);

    return (
        <>
            <h1>Advisor Tracker</h1>
            {selectedStudent ?
                <StudentDetails student={selectedStudent} exitStudentDetails={() => { setSelectedStudent(undefined); }} />
                : <StudentList students={students} setSelectedStudent={setSelectedStudent} />
            }
        </>
    )
}

export default App;
