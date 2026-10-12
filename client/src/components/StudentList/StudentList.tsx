import { useState } from "react";

import { getPriorityClass, getGPAClass, getRiskFlagClass, getLastContactDateClass } from "../../utils";

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
                    {studentKeys ? studentKeys.map((key) => (
                        <option key={key}>{key}</option>
                    )) : null}
                </select>
                <input type="text" onChange={(e) => { setFilter({ key: filter?.key || '', value: e.target.value }); }} value={filter?.value || ''} />
                <button onClick={() => { setFilter(undefined); }}>Reset Filter</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Priority Score</th>
                        <th>Name</th>
                        <th>GPA</th>
                        <th>Last Contact Date</th>
                        <th>Risk Flag</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => {
                        return (
                            <tr key={student.student_id} className="clickable" onClick={() => { setSelectedStudent(student); }}>
                                <td>
                                    <span className={getPriorityClass(student.priority_score)}>{student.priority_score}</span>
                                </td>
                                <td>
                                    <span> {student.first_name} {student.last_name}</span>
                                </td>
                                <td>
                                    <span className={getGPAClass(student.gpa ?? 0)}>{student.gpa}</span>
                                </td>
                                <td>
                                    <span className={getLastContactDateClass(student.last_contact_date)}>{
                                        student.last_contact_date && student.last_contact_date.length ? student.last_contact_date : 'N/A'
                                    }</span>
                                </td>
                                <td>
                                    <span className={getRiskFlagClass(student.risk_flag)}>{student.risk_flag}</span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </>
    )
}

export default StudentList
