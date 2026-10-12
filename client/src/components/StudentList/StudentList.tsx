import { useState } from "react";

import type { IStudent } from "../../types";

interface IFilter {
    key?: string;
    value?: string;
}

interface IProps {
    students: IStudent[];
    setSelectedStudent: React.Dispatch<React.SetStateAction<IStudent | undefined>>;
}

export const StudentList = ({ students, setSelectedStudent }: IProps) => {
    const [filter, setFilter] = useState<IFilter | undefined>();

    const studentKeys = students.length > 0 && Object.keys(students[0]);

    const filteredStudents =
        filter && filter.key && filter.value && studentKeys && studentKeys.includes(filter.key)
            ? students.filter(
                (student) => student[(filter.key as keyof IStudent)]?.toString().toLowerCase().includes(filter.value?.toLowerCase() ?? '') ?? false
            )
            : students;

    return (
        <>
            <h2>Student Viewer</h2>
            <div>
                <legend>Filter by:</legend>
                <select onChange={(e) => { setFilter({ key: e.target.value, value: filter?.value }); }} value={filter?.key || ''}>
                    {studentKeys && studentKeys.map((key) => (
                        <option key={key}>{key}</option>
                    ))}
                </select>
                <input type="text" onChange={(e) => { setFilter({ key: filter?.key || '', value: e.target.value }); }} value={filter?.value || ''} />
                <button onClick={() => { setFilter(undefined); }}>Reset Filter</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Priority Score</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Major</th>
                        <th>Class Year</th>
                        <th>Credits Earned</th>
                        <th>GPA</th>
                        <th>Advisor</th>
                        <th>Last Contact Date</th>
                        <th>Risk Flag</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.student_id} onClick={() => { setSelectedStudent(student); }}>
                            <td>{student.priority_score}</td>
                            <td>{student.first_name} {student.last_name}</td>
                            <td>{student.email}</td>
                            <td>{student.major}</td>
                            <td>{student.class_year}</td>
                            <td>{student.credits_earned}</td>
                            <td>{student.gpa}</td>
                            <td>{student.advisor}</td>
                            <td>{student.last_contact_date}</td>
                            <td>{student.risk_flag}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </>
    )
}

export default StudentList
