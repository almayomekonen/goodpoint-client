import { ActionParams, AdminTable, GenericColumn, useAlert } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import { ClassTeacherDetails } from '../../../common/types/classTeacherDetails';
import { useI18n } from '../../../i18n/mainI18n';
import { useGradeTableDropDownFilters } from '../../../lib/react-query/hooks/useGradeDropdownFilters';
import { ClassesRow } from '../../common/types/table-type/row-interfaces/classesRow.interface';
import ExcelClassesPopup from '../../components/ExcelClassesPopup';
import AddButtons from '../../components/add-buttons/AddButtons';
import AddClassPopupContent from '../../components/add-class-popup-content/AddClassPopupContent';
import DeletePopUp from '../../components/delete-popup/DeletePopUp';
import '../../common/styles/adminTableStyle.scss';
import './adminClasses.scss';

/**
 * AdminClassesTable Component
 *
 * This component renders the admin table for managing classes.
 */
const AdminClassesTable = () => {
    const navigate = useNavigate();
    const { openPopup, closePopup } = usePopup();
    const queryClient = useQueryClient();
    const showAlert = useAlert();

    const i18n = useI18n((i18n) => {
        return {
            general: i18n.general,
            gradesList: i18n.schoolGrades.gradesList,
            adminClassesTable: i18n.adminClassesTable,
            schoolGrades: i18n.schoolGrades,
        };
    });

    // Dropdown filters for the grade column
    const mainClassesDropdownFilters = useGradeTableDropDownFilters<ClassesRow>({
        noneOption: i18n.general.everything,
        columnKey: 'grade',
        dropDownKey: 'grades',
        multiple: true,
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
    });

    // Columns for the main classes table
    const mainClassesColumns: GenericColumn<ClassesRow>[] = [
        {
            key: 'class',
            label: i18n.general.class,
            renderColumn: (row) => {
                return `${i18n.gradesList[row.grade]}' ${row.classIndex}`;
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

    // Navigation function for row clicks
    const mainClassesNavigationFunction = (id: string | number | ClassTeacherDetails | undefined, row: ClassesRow) => {
        navigate(`${row.id}/students`);
    };

    // Handle the pop-up deletion confirmation
    async function confirmClassDelete(selected: string[], params: ActionParams<ClassesRow>): Promise<void> {
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.general.areYouSure,
            content: (
                <DeletePopUp
                    categoryTitle={i18n.adminClassesTable.classes}
                    allChecked={params.allChecked}
                    selected={selected}
                    count={params.selectedAmount!}
                    onDelete={async () => {
                        await deleteClass(selected, params);
                        await queryClient.invalidateQueries({ queryKey: [`table-load-classesTable`] });
                    }}
                />
            ),
            deleting: true,
        });
    }

    // Delete a class
    const deleteClass = async (selected: string[], params: ActionParams<ClassesRow>) => {
        try {
            await axios.delete('/api/classes/delete-admin-classes', {
                data: {
                    selected,
                    params,
                },
            });
            showAlert(`${i18n.general.classes} ${i18n.general.deletedSuccessfully} `, 'success');
        } catch (error: any) {
            showAlert(i18n.general.errorMessage, 'error');
        }
    };

    // Handle adding or editing a class
    const handleAddOrEditClass = () => {
        openPopup(popupType.REGULAR, {
            title: i18n.adminClassesTable.addNewMainClass,
            content: <AddClassPopupContent handleClose={closePopup} classType="class" />,
        });
    };

    return (
        <>
            <AdminTable<ClassesRow>
                id="classesTable"
                columns={mainClassesColumns}
                rowId="id"
                rowsPerPage={10}
                rowsUrl="/api/classes/admin-fetch-classes"
                checkboxColumn
                searchbar
                searchbarPlaceholder={i18n.adminClassesTable.searchByTeacher}
                fetchOnPaginate={false}
                dropdownFilters={mainClassesDropdownFilters}
                arrowColumn
                navigationFunction={mainClassesNavigationFunction}
                navigateOnRowClick
                extraHeader={
                    <AddButtons
                        excelText={i18n.general.addByExcel}
                        addText={i18n.adminClassesTable.addMainClass}
                        addFunc={handleAddOrEditClass}
                        addExcelFunc={() =>
                            openPopup(popupType.REGULAR, {
                                title: i18n.adminClassesTable.uploadClassesFile,
                                content: <ExcelClassesPopup />,
                            })
                        }
                    />
                }
                actionButtons={[
                    {
                        label: i18n.general.delete,
                        icon: <DeleteIcon />,
                        onAction: async (selected, params) => confirmClassDelete(selected as string[], params),
                        shouldResetCheckboxes: true,
                    },
                ]}
            />
        </>
    );
};

export default AdminClassesTable;
