import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { changeUserDetails } from '../api/personalAreaDetails.api';

import { useAlert } from '@hilma/forms';
import { useUser } from '../../../common/contexts/UserContext';
import { DEFAULT_NOTIFICATION } from '../../../common/consts/defaultNotifications';
import { TeacherDetails } from '../../../common/types/TeacherDetails.type';
import { DEFAULT_LANG } from '../../../i18n/i18n-consts';
import { useChangeLanguage, useI18n } from '../../../i18n/mainI18n';

/**
 * Custom hook for changing user details.
 * @returns The mutation query object.
 */
export const useChangeUserDetails = () => {
    const { user, setUser } = useUser();
    const alert = useAlert();
    const changeLang = useChangeLanguage();

    const i18n = useI18n((i18n) => ({ errors: i18n.errors, personalizedAreaText: i18n.personalizedAreaText }));
    const queryClient = useQueryClient();
    const query = useMutation<unknown, AxiosError, TeacherDetails>(
        ['user-details'],
        (teacherDetails: TeacherDetails) => changeUserDetails(teacherDetails),
        {
            onSuccess(_data, variables) {
                if (variables.languagesToggle) changeLang(variables.languagesToggle);

                const updatedUser = {
                    ...user,
                    firstName: variables.firstName || user.firstName,
                    lastName: variables.lastName || user.lastName,
                    phoneNumber: variables.phoneNumber ?? user.phoneNumber,
                    username: variables.username || user.username,
                    systemNotifications:
                        variables.systemNotifications !== undefined
                            ? variables.systemNotifications
                            : user.systemNotifications || DEFAULT_NOTIFICATION,
                    preferredLanguage:
                        variables.languagesToggle !== undefined
                            ? variables.languagesToggle
                            : user.preferredLanguage || DEFAULT_LANG,
                };
                queryClient.invalidateQueries(['get-user-data']);
                setUser(updatedUser);

                alert(i18n.personalizedAreaText.success, 'success');
            },
            onError(error) {
                if (error.status === 409) alert(i18n.errors.emailAlreadyExists, 'error');
                else alert(i18n.errors.somethingWentWrong, 'error');
            },
        },
    );
    return { ...query };
};
