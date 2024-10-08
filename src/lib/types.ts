export interface TableColPropsType {
    header: string;
    accessor: string;
    className?: string;
}

export interface TeacherType {
    id: number,
    teacherId: string,
    name: string,
    email?: string,
    photo: string,
    phone?: string,
    subjects: string[],
    classes: string[],
    address: string[],
}

export interface StudentType {
    id: number,
    studentId: string,
    name: string,
    email?: string,
    photo: string,
    phone?: string,
    grade: number,
    class: string,
    address: string[],
}


export interface ParentType {
    id: number;
    name: string;
    email?: string;
    students: string[];
    phone: string;
    address: string;
}

export interface SubjectType {
    id: number;
    name: string;
    teachers: string[];
};

export interface ClassType {
    id: number;
    name: string;
    capacity: number;
    grade: number;
    supervisor: string;
};

export interface AssignmentType {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    dueDate: string;
};

export interface AnnouncementType {
    id: number;
    title: string;
    class: string;
    date: string;
};

export interface EventType {
    id: number;
    title: string;
    class: string;
    date: string;
    startTime: string;
    endTime: string;
};

export interface ExamType {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    date: string;
};

export interface LessonType {
    id: number;
    subject: string;
    class: string;
    teacher: string;
};

export interface ResultType {
    id: number;
    subject: string;
    class: string;
    teacher: string;
    student: string;
    type: "exam" | "assignment";
    date: string;
    score: number;
};