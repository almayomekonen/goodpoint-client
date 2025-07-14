import axios from 'axios';
import { SchoolGrades } from '../../../common/enums';
type StudentDetails = {
    id: number;
    firstName: string;
    lastName: string;
    class: {
        classIndex: number;
        grade: SchoolGrades;
    };
};
export const getStudentsByGrades = async (grades: SchoolGrades[]) => {
    const { data } = await axios.get<{ [key: string]: StudentDetails[] }>(`/api/student/get-students-by-grades`, {
        params: {
            grades,
        },
    });
    return data;
};

export const getStudentsOfStudyGroup = async (studyGroupId: number) => {
    const { data } = await axios.get<number[]>(`/api/student/get-students-ids-of-studyGroup/${studyGroupId}`);
    return data;
};
