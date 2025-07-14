import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gender, PresetCategory } from '../../../common/enums';
import { OpenSentence } from '../../../common/types';
import {
    addAdminPm,
    addTeacherPmQuery,
    deletePresetMessageQuery,
    editAdminPm,
    getPresetMessagesQuery,
} from '../api/presetMessageBank.api';
import { useI18n } from '../../../i18n/mainI18n';
import { useAlert } from '../../../common/contexts/AlertContext';
import { adminQueryKeysWithPrefix } from '../../../admin/common/consts/adminTableQueryKeys';

export const useGetPresetMessageQuery = () =>
    useQuery(['presetMessagesBank'], getPresetMessagesQuery, { refetchOnMount: false });

export const useDeletePresetMessage = () => {
    const queryClient = useQueryClient();
    const { errors, general } = useI18n((i18n) => {
        return {
            errors: i18n.errors,
            general: i18n.general,
        };
    });
    const alert = useAlert();

    return useMutation((id: number) => deletePresetMessageQuery(id), {
        onSuccess: (result, id) => {
            alert(`${general.thePm} ${general.deletedSuccessfullySingle} `, 'success');
            queryClient.setQueryData<OpenSentence[] | undefined>(['presetMessagesBank'], (old) => {
                return old?.filter((message) => message.id !== id);
            });
        },
        onError: () => {
            alert(errors.somethingWentWrong, 'error');
        },
    });
};

export const useAddTeacherPm = () => {
    const queryClient = useQueryClient();
    const { errors, general } = useI18n((i18n) => {
        return {
            errors: i18n.errors,
            general: i18n.general,
        };
    });
    const alert = useAlert();
    return useMutation(
        (data: { message: string; category: PresetCategory; gender: Gender }) =>
            addTeacherPmQuery(data.message, data.category, data.gender),
        {
            onSuccess: (result) => {
                alert(`${general.thePm} ${general.addedSuccessfullySingle} `, 'success');
                queryClient.setQueryData<OpenSentence[] | undefined>(['presetMessagesBank'], (old) => {
                    return [result, ...old!];
                });
            },
            onError: () => {
                alert(errors.somethingWentWrong, 'error');
            },
        },
    );
};

export const useAddAdminPm = () => {
    const queryClient = useQueryClient();
    const { errors, general } = useI18n((i18n) => {
        return {
            errors: i18n.errors,
            general: i18n.general,
        };
    });
    const alert = useAlert();
    return useMutation(
        (data: { message: string; category: PresetCategory; gender: Gender }) =>
            addAdminPm(data.message, data.category, data.gender),
        {
            onSuccess: () => {
                alert(`${general.thePm} ${general.addedSuccessfullySingle} `, 'success');
                queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.PMTable] });
            },
            onError: () => {
                alert(errors.somethingWentWrong, 'error');
            },
        },
    );
};

export const useEditAdminPm = () => {
    const queryClient = useQueryClient();
    const { errors, general } = useI18n((i18n) => {
        return {
            errors: i18n.errors,
            general: i18n.general,
        };
    });
    const alert = useAlert();
    return useMutation(
        (data: { id: number; message: string; category: PresetCategory; gender: Gender }) =>
            editAdminPm(data.id, data.message, data.category, data.gender),
        {
            onSuccess: () => {
                alert(`${general.thePm} ${general.editedSuccessfullySingle} `, 'success');
                queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.PMTable] });
            },
            onError: () => {
                alert(errors.somethingWentWrong, 'error');
            },
        },
    );
};
