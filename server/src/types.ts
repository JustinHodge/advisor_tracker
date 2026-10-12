export interface IStudent {
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    major: string | null;
    class_year: string | null;
    credits_earned: number;
    gpa: number | null;
    advisor: string | null;
    last_contact_date: string | null;
    risk_flag: string;
    priority_score: number;
}

export interface IContactNote {
    note_id: string;
    student_id: string;
    contact_date: string;
    contact_type: string | null;
    advisor: string | null;
    note_text: string;
}
