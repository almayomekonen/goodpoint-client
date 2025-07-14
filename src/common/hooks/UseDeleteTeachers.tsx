import { ActionParams, useAlert } from '@hilma/forms';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/mainI18n';
import { usePopup } from '../contexts/PopUpProvider';
import { TeacherRow } from '../../admin/common/types/table-type/row-interfaces/teacherRow.interface';
import { popupType } from '../enums/popUpType.enum';
import axios from 'axios';
import DeletePopUp from '../../admin/components/delete-popup/DeletePopUp';
import { adminQueryKeysWithPrefix } from '../../admin/common/consts/adminTableQueryKeys';

/**
 * Custom hook for deleting teachers in admin.
 * @returns {function} confirmDeleteTeacher - Function to confirm deletion of teachers.
 */
export const useDeleteTeachers = () => {
    const queryClient = useQueryClient();
    // ui
    const { openPopup } = usePopup();
    const alert = useAlert();
    // navigation
    const navigate = useNavigate();
    // translations
    const { teachersTable, general, errors } = useI18n((i18n) => {
        return {
            teachersTable: i18n.teachersTable,
            general: i18n.general,
            errors: i18n.errors,
        };
    });

    async function onDeleteTeachers(selected: string[], params: ActionParams<TeacherRow>, specificDelete?: string) {
        try {
            const { allChecked, userSearch, filters } = params;

            // Make API call to delete the selected students

            const { data } = await axios.delete('/api/staff/delete-teachers', {
                data: {
                    selected,
                    params: {
                        allChecked,
                        userSearch,
                        filters,
                    },
                },
            });

            alert(` ${data.affected || ''} ${teachersTable.teachers} ${general.deletedSuccessfully} `, 'success');
            specificDelete && navigate('/admin/teachers');
        } catch (error: unknown) {
            alert(errors.noDeleted, 'error');
        }
    }

    async function confirmDeleteTeacher(selected: string[], params: ActionParams<TeacherRow>, specificDelete?: string) {
        openPopup(popupType.ARE_U_SURE, {
            title: general.areYouSure,
            content: (
                <DeletePopUp
                    categoryTitle={teachersTable.teachers}
                    allChecked={params.allChecked}
                    selected={selected}
                    count={params.selectedAmount!}
                    specificDelete={specificDelete}
                    onDelete={async () => {
                        await onDeleteTeachers(selected, params, specificDelete);
                        await queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.teacher] });
                    }}
                />
            ),
            deleting: true,
        });
    }
    return confirmDeleteTeacher;
};
