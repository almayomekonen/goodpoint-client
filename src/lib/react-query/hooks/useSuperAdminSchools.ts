import { useAlert } from '@hilma/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { adminQueryKeysWithPrefix } from '../../../admin/common/consts/adminTableQueryKeys';
import { Admin } from '../../../common/types/admin.type';
import { useI18n } from '../../../i18n/mainI18n';
export function useAddSchool() {
    const queryClient = useQueryClient();
    const showAlert = useAlert();
    const i18n = useI18n((i) => i.superAdmin);
    return useMutation(
        async (data: { name: string; code: string }) => {
            const postReq = await axios.post('/api/schools/add-school', data);
            return postReq.data;
        },
        {
            onSuccess: (result) => {
                //alert for successfull edit
                showAlert(i18n.addedSchool, 'success');

                queryClient.setQueryData<any[] | undefined>([adminQueryKeysWithPrefix.schoolsTable], (old) => {
                    return [...old!, { ...result, numOfStudents: 0 }];
                });
            },
        },
    );
}

export function useEditSchool() {
    const queryClient = useQueryClient();
    const showAlert = useAlert();
    const i18n = useI18n((i) => i.superAdmin);

    return useMutation(
        async (data: { name: string; code: string; id: number }) => {
            const postReq = await axios.patch('/api/schools/update-school', data);
            return postReq.data;
        },
        {
            onSuccess: (data: { name: string; code: string; id: number }) => {
                //alert for successful edit
                showAlert(i18n.editedSchool, 'success');

                queryClient.setQueryData<any[] | undefined>([adminQueryKeysWithPrefix.schoolsTable], (old) => {
                    return old!.map((school) => {
                        if (school.id === data.id) {
                            return { ...school, name: data.name, code: data.code };
                        }
                        return school;
                    });
                });
            },
        },
    );
}

export function useDeleteSchool() {
    const queryClient = useQueryClient();
    const showAlert = useAlert();
    const i18n = useI18n((i) => i.superAdmin);

    return useMutation(
        async (id: number) => {
            const postReq = await axios.delete('/api/schools/delete-school', { data: { id } });
            return postReq.data;
        },
        {
            onSuccess: (schoolId) => {
                //alert for successful edit
                showAlert(i18n.deletedSchool, 'success');

                queryClient.setQueryData<any[] | undefined>([adminQueryKeysWithPrefix.schoolsTable], (old) => {
                    return old!.filter((school) => school.id !== schoolId);
                });
            },
            onError: () => {
                showAlert(i18n.failedToDeleteSchool, 'error');
            },
        },
    );
}

export function useAddAdmin(schoolId: number) {
    //add the admin role to the user
    return useMutation(async (admin: Admin) => {
        const postReq = await axios.post('/api/staff/add-admin', { ...admin, schoolId });
        return postReq.data;
    });
}

export function useDeleteAdmin(schoolId: number) {
    //remove the admin role from the user
    const queryClient = useQueryClient();
    return useMutation(
        async (data: { adminId: string; schoolId: number }) => {
            const postReq = await axios.delete('/api/staff/delete-admin', { data });
            return postReq.data;
        },
        {
            onSuccess: (adminId: string) => {
                queryClient.setQueryData<Admin[] | undefined>(
                    [`${adminQueryKeysWithPrefix.adminsTable}-${schoolId}`],
                    (oldData) => {
                        return oldData?.filter((admin) => admin.id !== adminId);
                    },
                );
            },
        },
    );
}
