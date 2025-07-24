import apiClient from '../../../api/config';
import { TeacherDetails } from '../../../common/types/TeacherDetails.type';

export const changeUserDetails = async (teacherDetails: TeacherDetails) => {
    const { data } = await apiClient.put('/api/staff/update-details', {
        firstName: teacherDetails.firstName,
        lastName: teacherDetails.lastName,
        phoneNumber: teacherDetails.phoneNumber,
        username: teacherDetails.username,
        systemNotifications: teacherDetails.systemNotifications,
    });
    return data;
};
