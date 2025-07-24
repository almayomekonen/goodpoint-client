import React from 'react';
//lib
import { AdminTable, GenericColumn } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
//lib interfaces
import { useI18n } from '../../../i18n/mainI18n';
//types:
import { popupType } from '../../../common/enums/popUpType.enum';
//contexts
import { usePopup } from '../../../common/contexts/PopUpProvider';
//components
import { useDeleteTeachers } from '../../../common/hooks/UseDeleteTeachers';
import { useGradeTableDropDownFilters } from '../../../lib/react-query/hooks/useGradeDropdownFilters';
import { adminQueryKeys } from '../../common/consts/adminTableQueryKeys';
import { TeacherRow } from '../../common/types/table-type/row-interfaces/teacherRow.interface';
import AddButtons from '../../components/add-buttons/AddButtons';
import AddTeacherPopUp from '../../components/teachers-admin-table/add-pop-teacher/AddTeacherPopUp';
import ExcelTeachersPopUp from '../../components/teachers-admin-table/excel-teacher-pop-up/ExcelTeachersPopUp';
import { emptyValueAdminTable } from '../../common/consts/emptyValueAdminTable';
import { HelmetTitlePage } from '../../../components/HelmetTitlePage';
import { defaultQueryConfig } from '../../../lib/react-query/config/queryConfig';

//Query to change the format of phone numbers in a database:
//update table_name set column = concat('0',substring(column,4,12)) where substring(column,1,3)='972'

/**
 * teachers page component.
 * Renders a page for managing teachers using admin hilma forms.
 *
 * @component
 */
const TeachersAdminTable: React.FC = () => {
    // react query data hooks

    // hooks ui
    const { openPopup } = usePopup();
    const navigate = useNavigate();

    // translated strings
    const { studentsTable, teachersTable, adminTopBar, gradesList, general, errors, pagesTitles } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            teachersTable: i18n.teachersTable,
            adminTopBar: i18n.adminTopBar,
            gradesList: i18n.schoolGrades.gradesList,
            general: i18n.general,
            errors: i18n.errors,
            pagesTitles: i18n.pagesTitles,
        };
    });

    const dropdownFilters = useGradeTableDropDownFilters<TeacherRow>({
        columnKey: 'classes',
        dropDownKey: 'grade',
        noneOption: general.everything,
        multiple: true,
        selectProps: {
            MenuProps: {
                style: {
                    position: 'absolute',
                    zIndex: 1,
                },
                disableScrollLock: true,
            },
            placeholder: studentsTable.dropdownFilters,
        },
    });

    const deleteTeacher = useDeleteTeachers();

    // tables columns
    const columns: GenericColumn<TeacherRow>[] = [
        {
            key: 'firstName',
            label: teachersTable.firstName,
        },
        {
            key: 'lastName',
            label: teachersTable.lastName,
        },
        {
            key: 'classes',
            label: studentsTable.classId,
            renderColumn(row: TeacherRow) {
                const classes = row.classes?.slice(0, 3) ?? [];

                return (
                    classes
                        .map((classInfo) => {
                            const grade = gradesList[classInfo?.grade] ?? '';
                            const classIndex = classInfo?.classIndex ?? '';
                            return `${grade}${classIndex}`;
                        })
                        .join(', ') || emptyValueAdminTable
                );
            },
        },
    ];

    return (
        <ErrorBoundary fallback={<div>{errors.somethingWentWrong}</div>}>
            <HelmetTitlePage title={pagesTitles.adminTeachers} />

            <div className="admin-table-container">
                <AdminTable
                    id={adminQueryKeys.teachersTable}
                    columns={columns}
                    rowsUrl={'/api/staff/get-teachers-of-school-admin'}
                    queryStaleTime={defaultQueryConfig.staleTime}
                    rowId="id"
                    rowsPerPage={10}
                    title={adminTopBar.teacher}
                    searchbar
                    searchbarPlaceholder={studentsTable.searchbarPlaceholder}
                    checkboxColumn
                    arrowColumn
                    navigateOnRowClick
                    noResultsText={general.noTeachers}
                    dropdownFilters={dropdownFilters}
                    extraHeader={
                        <AddButtons
                            exportReportOptions={{
                                url: '/api/staff/admin-teachers-report',
                                fileName: 'teachers-report',
                            }}
                            addText={teachersTable.addTeacher}
                            addFunc={() =>
                                openPopup(popupType.REGULAR, {
                                    title: teachersTable.addTeacher,
                                    content: <AddTeacherPopUp />,
                                })
                            }
                            addExcelFunc={() =>
                                openPopup(popupType.REGULAR, {
                                    title: teachersTable.addExcel,
                                    content: <ExcelTeachersPopUp />,
                                })
                            }
                        />
                    }
                    navigationFunction={(id, teacherRow) => {
                        navigate(`/admin/teachers/${id}`, {
                            state: teacherRow,
                        });
                    }}
                    actionButtons={[
                        {
                            label: studentsTable.delete,
                            icon: <DeleteIcon color="primary" />,
                            onAction: async (selected, params) => deleteTeacher(selected as string[], params),
                            shouldResetCheckboxes: true,
                        },
                    ]}
                />
            </div>
        </ErrorBoundary>
    );
};

export default TeachersAdminTable;
