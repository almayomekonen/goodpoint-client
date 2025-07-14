import { ActionParams, AdminTable, GenericColumn, OnMountDropdownFilter } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../../common/contexts/AlertContext';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { SchoolGrades } from '../../../common/enums';
import { popupType } from '../../../common/enums/popUpType.enum';
import { ClassTeacherDetails } from '../../../common/types/classTeacherDetails';
import { useI18n } from '../../../i18n/mainI18n';
import { useGetAllStudyGroupsGrades } from '../../../lib/react-query/hooks/useClasses';
import { ClassesRow, StudyGroupsRow } from '../../common/types/table-type/row-interfaces/classesRow.interface';
import AddButtons from '../../components/add-buttons/AddButtons';
import AddClassPopupContent from '../../components/add-class-popup-content/AddClassPopupContent';
import DeletePopUp from '../../components/delete-popup/DeletePopUp';

import '../../common/styles/adminTableStyle.scss';
import './adminClasses.scss';

/**
 * AdminClassesTable Component
 *
 * This component renders the admin table for managing study groups.
 */
const AdminStudyGroupsTable = () => {
    const { data: grades } = useGetAllStudyGroupsGrades();
    const navigate = useNavigate();
    const { openPopup, closePopup } = usePopup();
    const queryClient = useQueryClient();
    const alert = useAlert();

    const i18n = useI18n((i18n) => {
        return {
            general: i18n.general,
            adminClassesTable: i18n.adminClassesTable,
            schoolGrades: i18n.schoolGrades,
        };
    });

    const studyGroupsDropdownFilters: OnMountDropdownFilter<StudyGroupsRow>[] = [
        {
            columnKey: 'grades',
            noneOption: i18n.general.everything,
            dropDownKey: 'grades',
            multiple: true,
            options:
                grades?.map((grade) => {
                    return {
                        optionKey: grade,
                        content: `${i18n.schoolGrades.grade} ${i18n.schoolGrades.gradesList[grade]}`,
                        filter(value) {
                            return value?.includes(grade) || false;
                        },
                    };
                }) || [],
            selectProps: {
                MenuProps: {
                    style: {
                        position: 'absolute',
                        zIndex: 1,
                    },
                    disableScrollLock: true,
                },
                placeholder: i18n.schoolGrades.grade,
            },
        },
    ];

    const studyGroupsColumns: GenericColumn<StudyGroupsRow>[] = [
        {
            key: 'name',
            label: i18n.general.name,
        },
        {
            key: 'grades',
            label: i18n.schoolGrades.grade,
            renderColumn: (row) => {
                return (row.grades?.map((grade) => `${i18n.schoolGrades.gradesList[grade]}`) || []).join(', ');
            },
        },
        {
            key: 'teacher',
            label: i18n.general.teacher,
            renderColumn: (row) => {
                return row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : '-';
            },
        },
    ];

    const studyGroupNavigationFunction = (
        id: string | number | ClassTeacherDetails | SchoolGrades[] | undefined,
        row: StudyGroupsRow,
    ) => {
        navigate(`${row.id}/students`);
    };

    // handle pop-up deletion
    async function confirmStudyGroupDelete(selected: string[], params: ActionParams<ClassesRow>): Promise<void> {
        // I show the "Are you sure?" popup
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.general.areYouSure,
            content: (
                <DeletePopUp
                    categoryTitle={i18n.adminClassesTable.studyGroups}
                    allChecked={params.allChecked}
                    selected={selected}
                    count={params.selectedAmount!}
                    onDelete={async () => {
                        await deleteStudyGroup(selected, params);
                        await queryClient.invalidateQueries({ queryKey: [`table-load-StudyGroupsTable`] });
                    }}
                />
            ),
            deleting: true,
        });
    }

    const deleteStudyGroup = async (selected: string[], params: ActionParams<ClassesRow>) => {
        try {
            // Make API call to delete the selected students
            await axios.delete('/api/study-group/delete-admin-study-groups', {
                data: {
                    selected,
                    params,
                },
            });
            alert(`${i18n.general.classes} ${i18n.general.deletedSuccessfully} `, 'success');
        } catch (error: any) {
            alert(i18n.general.errorMessage, 'error');
        }
    };

    const handleAddStudyGroupFunc = () => {
        openPopup(popupType.REGULAR, {
            title: i18n.adminClassesTable.addStudyGroup,
            content: <AddClassPopupContent handleClose={() => closePopup()} classType="studyGroup" />,
        });
    };
    return (
        <>
            <AdminTable<StudyGroupsRow>
                id="StudyGroupsTable"
                columns={studyGroupsColumns}
                rowId="id"
                rowsPerPage={10} // amount of rows per page
                rowsUrl="/api/study-group/admin-get-study-groups"
                checkboxColumn
                searchbar
                searchbarPlaceholder={i18n.adminClassesTable.searchByTeacher}
                fetchOnPaginate={false}
                dropdownFilters={studyGroupsDropdownFilters}
                arrowColumn
                navigationFunction={studyGroupNavigationFunction}
                navigateOnRowClick
                extraHeader={
                    <AddButtons
                        showExcelButton={false}
                        addText={i18n.adminClassesTable.addStudyGroup}
                        addFunc={handleAddStudyGroupFunc}
                    />
                }
                actionButtons={[
                    {
                        label: i18n.general.delete,
                        icon: <DeleteIcon />,
                        onAction: async (selected, params) => confirmStudyGroupDelete(selected as string[], params),
                        shouldResetCheckboxes: true,
                    },
                ]}
            />
        </>
    );
};

export default AdminStudyGroupsTable;
