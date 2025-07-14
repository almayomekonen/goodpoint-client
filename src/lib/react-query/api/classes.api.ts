import axios from 'axios';
import { ClassFormKeys } from '../../../admin/common/types/table-type/classFormKeys.type';
import { StudyGroupFormKeys } from '../../../admin/common/types/table-type/studyGroupFormKeys.type';
import { SchoolGrades } from '../../../common/enums';
import { StudyGroupServerDetails } from '../../../admin/common/types/table-type/StudyGroupServerDetails';
import { ClassServerDetails } from '../../../admin/common/types/table-type/classServerDetails';

export const getClassDetails = async (id: number) => {
    const { data } = await axios.get<ClassFormKeys>(`/api/classes/admin-fetch-class/${id}`);
    return data;
};

export const addOrEditClass = async (classDetails: ClassServerDetails) => {
    const { data } = await axios.post<ClassFormKeys[]>('/api/classes/admin-add-or-edit-class-form', classDetails);
    return data;
};

export const addOrEditStudyGroup = async (studyGroupDetails: StudyGroupServerDetails) => {
    const { data } = await axios.post<StudyGroupFormKeys[]>(
        '/api/study-group/add-or-edit-study-group',
        studyGroupDetails,
    );
    return data;
};

export const getAllStudyGroupsGrades = async () => {
    const { data } = await axios.get<SchoolGrades[]>('/api/study-group/get-all-study-groups-grades');
    return data;
};

export const getStudyGroupDetails = async (id: number) => {
    const { data } = await axios.get<StudyGroupFormKeys>(`/api/study-group/admin-fetch-study-group/${id}`);
    return data;
};

export const addStudentsToStudyGroup = async (details: { studyGroupId: number; studentsIds: number[] }) => {
    const { data } = await axios.post('/api/study-group/add-students-to-study-group', details);
    return data;
};
