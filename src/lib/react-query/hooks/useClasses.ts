import { useMutation, useQuery } from '@tanstack/react-query';
import {
    addOrEditClass,
    addOrEditStudyGroup,
    addStudentsToStudyGroup,
    getAllStudyGroupsGrades,
    getClassDetails,
    getStudyGroupDetails,
} from '../api/classes.api';
import { useQueryClient } from '@tanstack/react-query';
import { useI18n } from '../../../i18n/mainI18n';
import { SchoolGrades } from '../../../common/enums';
import { StudyGroupServerDetails } from '../../../admin/common/types/table-type/StudyGroupServerDetails';
import { ClassServerDetails } from '../../../admin/common/types/table-type/classServerDetails';
import { useAlert } from '@hilma/forms';
import { adminQueryKeysWithPrefix } from '../../../admin/common/consts/adminTableQueryKeys';
import { usePopup } from '../../../common/contexts/PopUpProvider';

//classes
export const useGetClassDetails = (id: number) => useQuery(['class' + id], () => getClassDetails(id));

export const useAddOrEditClass = () => {
    const alert = useAlert();
    const client = useQueryClient();
    const errors = useI18n((i18n) => i18n.errors);
    const { closePopup } = usePopup();

    return useMutation((details: ClassServerDetails) => addOrEditClass(details), {
        onSuccess(data, variables) {
            client.invalidateQueries(['table-load-studentsTable' + variables.id]);
            client.invalidateQueries(['table-load-classesTable']);
            client.invalidateQueries(['class' + variables.id]);
            closePopup();
        },
        onError(error: any) {
            if (error.data?.message === 'class already exists') alert(errors.classAlreadyExist, 'error');
            else alert(errors.somethingWentWrong, 'error');
        },
    });
};

//study groups

export const useGetStudyGroupDetails = (id: number) => useQuery(['studyGroup' + id], () => getStudyGroupDetails(id));

export const useGetAllStudyGroupsGrades = () => useQuery<SchoolGrades[]>(['studyGroups'], getAllStudyGroupsGrades);

export const useAddOrEditStudyGroup = () => {
    const alert = useAlert();
    const client = useQueryClient();
    const errors = useI18n((i18n) => i18n.errors);
    const { closePopup } = usePopup();

    return useMutation((details: StudyGroupServerDetails) => addOrEditStudyGroup(details), {
        onSuccess(data, variables) {
            client.invalidateQueries([adminQueryKeysWithPrefix.studyGroups]);
            client.invalidateQueries([adminQueryKeysWithPrefix.student + variables.id]);
            client.invalidateQueries(['studentsByGrades']);
            client.invalidateQueries(['studyGroup' + variables.id]);
            closePopup();
        },
        onError() {
            alert(errors.somethingWentWrong, 'error');
        },
    });
};

export const useAddStudentsToStudyGroup = () => {
    const alert = useAlert();
    const client = useQueryClient();
    const errors = useI18n((i18n) => i18n.errors);
    return useMutation((details: { studyGroupId: number; studentsIds: number[] }) => addStudentsToStudyGroup(details), {
        onSuccess(data, variables) {
            client.invalidateQueries([adminQueryKeysWithPrefix.student + variables.studyGroupId]);
            client.invalidateQueries(['studentsOfStudyGroup' + variables.studyGroupId]);
        },
        onError() {
            alert(errors.somethingWentWrong, 'error');
        },
    });
};
