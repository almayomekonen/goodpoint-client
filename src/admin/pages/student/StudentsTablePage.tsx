import React from 'react';

import { ActionParams, AdminTable, GenericColumn, useAlert } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useI18n } from '../../../i18n/mainI18n';
//funcs:
import { formatPhoneNumber } from '../../common/functions/formatPhoneNumbers';
//types:
import { popupType } from '../../../common/enums/popUpType.enum';
import { StudentRow } from '../../common/types/table-type/row-interfaces/index';
//contexts
import { usePopup } from '../../../common/contexts/PopUpProvider';
//components
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetTitlePage } from '../../../components/HelmetTitlePage';
import { useGradeTableDropDownFilters } from '../../../lib/react-query/hooks/useGradeDropdownFilters';
import { adminQueryKeys, adminQueryKeysWithPrefix } from '../../common/consts/adminTableQueryKeys';
import { emptyValueAdminTable } from '../../common/consts/emptyValueAdminTable';
import AddButtons from '../../components/add-buttons/AddButtons';
import DeletePopUp from '../../components/delete-popup/DeletePopUp';
import AddOrEditStudentPopUpContent from '../../components/studets-admin-table/add-student-pop-up/AddOrEditStudentPopUpContent';
import ExcelStudentsPopUp from '../../components/studets-admin-table/excel-students-pop-up/ExcelStudentsPopUp';
import MoveStudentsPopUp, {
    MovePopUp,
} from '../../components/studets-admin-table/move-students-pop-up/MoveStudentsPopUp';
import { defaultQueryConfig } from '../../../lib/react-query/config/queryConfig';

//Query to change the format of phone numbers in a database:
//update table_name set column = concat('0',substring(column,4,12)) where substring(column,1,3)='972'

interface StudentsPageProps {
    classDetails?: {
        id: number;
        classType: 'class' | 'studyGroup';
    };
}

/**
 * StudentsPage component.
 * Renders a page for managing students using admin hilma forms.
 *
 * @component
 * @example
 * return (
 *   <StudentsPage classDetails={{ id: 1, classType: 'class' }} />
 * )
 */
const StudentsPage: React.FC<StudentsPageProps> = ({ classDetails }) => {
    // react query data hooks
    const queryClient = useQueryClient();

    // hooks ui
    const { openPopup } = usePopup();
    const navigate = useNavigate();
    const alert = useAlert();

    // translated strings
    const { studentsTable, adminTopBar, gender, gradesList, general, errors, pagesTitles } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            adminTopBar: i18n.adminTopBar,
            gender: i18n.gender,
            gradesList: i18n.schoolGrades.gradesList,
            general: i18n.general,
            errors: i18n.errors,
            adminClassesTable: i18n.adminClassesTable,
            pagesTitles: i18n.pagesTitles,
        };
    });

    const dropdownFilters = useGradeTableDropDownFilters<StudentRow>(
        {
            columnKey: 'id',
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
        },
        {
            floatingStudents: true,
        },
    );

    // handle pop-up deletion
    async function confirmDeleteStudents(selected: string[], params: ActionParams<StudentRow>): Promise<void> {
        // I show the "Are you sure?" popup
        openPopup(popupType.ARE_U_SURE, {
            title: general.areYouSure,
            content: (
                <DeletePopUp
                    allChecked={params.allChecked}
                    selected={selected}
                    count={params.selectedAmount!}
                    categoryTitle={studentsTable.deletePopUp.students}
                    onDelete={async () => {
                        await onDeleteStudents(selected, params);
                        await queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.student] });
                        queryClient.removeQueries(['studentsByGrades']);
                        await queryClient.invalidateQueries(['update-students'], { type: 'inactive' });
                    }}
                />
            ),
            deleting: true,
        });
    }

    const onDeleteStudents = async (selected: string[], params: ActionParams<StudentRow>) => {
        try {
            const { allChecked, userSearch, filters } = params;

            // Make API call to delete the selected students

            const { data } = await axios.delete('/api/student/delete-students', {
                data: {
                    selected,
                    params: {
                        allChecked,
                        userSearch,
                        filters,
                    },
                },
            });

            alert(` ${data.affected || ''} ${general.students} ${general.deletedSuccessfully} `, 'success');
        } catch (error: unknown) {
            alert(errors.noDeleted, 'error');
        }
    };

    async function confirmMoveStudents(selected: string[], params: ActionParams<StudentRow>): Promise<void> {
        openPopup(popupType.REGULAR, {
            title: studentsTable.moveStudentsPopUp.moveStudentsTitle,
            content: (
                <>
                    <MoveStudentsPopUp
                        count={params.allChecked ? params.selectedAmount! : selected.length}
                        onConfirm={(values: MovePopUp) => onMoveStudents(selected, params, values)}
                    />
                </>
            ),
        });
    }

    const onMoveStudents = async (selected: string[], params: ActionParams<StudentRow>, values: MovePopUp) => {
        try {
            const { allChecked, userSearch, filters } = params;

            const { classObj } = values;
            const { grade, classIndex } = JSON.parse(classObj?.value ?? '');

            // Make API call to delete the selected students
            const { data } = await axios.post<{ affected: number }>(`/api/student/move-students`, {
                data: {
                    selected,
                    params: {
                        allChecked,
                        userSearch,
                        filters,
                    },
                    grade,
                    classIndex,
                },
            });

            // Invalidate queries for students admin
            queryClient.invalidateQueries([adminQueryKeysWithPrefix.student]);

            // Invalidate query for student itself
            queryClient.invalidateQueries(['get-student-by-id']);

            alert(` ${data.affected || ''} ${general.students} ${general.updateSuccessfully} `, 'success');
        } catch (error: unknown) {
            alert(errors.noDeleted, 'error');
        }
    };

    // tables columns
    const columns: GenericColumn<StudentRow>[] = [
        {
            key: 'firstName',
            label: studentsTable.fullName,
            renderColumn(row: StudentRow) {
                return `${row.firstName} ${row.lastName}`;
            },
        },
        {
            key: 'gender',
            label: studentsTable.gender,
            renderColumn(row: StudentRow) {
                return row.gender === 'MALE' ? gender.MALE : gender.FEMALE;
            },
        },
        {
            key: 'classId',
            label: studentsTable.classId,
            renderColumn(row: StudentRow) {
                return `${gradesList[row.class?.grade] ?? emptyValueAdminTable}${row.class?.classIndex ?? ''}`;
            },
        },
        {
            key: 'relativesPhoneNumbers[0]',
            label: `${studentsTable.phoneNumbers.parentPhone} 1`,
            renderColumn(row: StudentRow) {
                return formatPhoneNumber(row.relativesPhoneNumbers[0]?.phone);
            },
        },
        {
            key: 'relativesPhoneNumbers[1]',
            label: `${studentsTable.phoneNumbers.parentPhone} 2`,
            renderColumn(row: StudentRow) {
                return formatPhoneNumber(row.relativesPhoneNumbers[1]?.phone);
            },
        },
        {
            key: 'phoneNumber',
            label: studentsTable.phoneNumbers.StudentPhoneNumber,
            renderColumn(row: StudentRow) {
                return formatPhoneNumber(row.phoneNumber);
            },
        },
    ];

    const rowUrl = classDetails
        ? `/api/student/get-admin-students-by-${classDetails.classType}/${classDetails.id}`
        : `/api/schools/get-students-of-school-admin`;

    return (
        <ErrorBoundary fallback={<div>{errors.somethingWentWrong}</div>}>
            <HelmetTitlePage title={pagesTitles.adminStudents} />
            <div className={clsx('admin-table-container', classDetails && 'sub-table')}>
                <AdminTable
                    id={adminQueryKeys.studentsTable}
                    columns={columns}
                    rowsUrl={rowUrl}
                    fetchOnPaginate
                    rowsPerPage={10} // amount of rows per page
                    requestPayload={{}}
                    queryStaleTime={defaultQueryConfig.staleTime}
                    pageParamName="pageNumber" // parms sent to the server
                    limitParamName="perPage" // parms sent to the server
                    rowId="id"
                    title={classDetails ? '' : adminTopBar.students}
                    searchbar={!classDetails}
                    searchbarPlaceholder={studentsTable.searchbarPlaceholder}
                    checkboxColumn={!classDetails}
                    arrowColumn
                    navigateOnRowClick
                    noResultsText={general.noStudents}
                    extraHeader={
                        <AddButtons
                            addText={studentsTable.studentsTableButtons.addStudent}
                            addFunc={() => {
                                openPopup(popupType.REGULAR, {
                                    title: studentsTable.addPopUp.PopUpTitle,
                                    content: <AddOrEditStudentPopUpContent />,
                                });
                                queryClient.invalidateQueries({ queryKey: ['schoolClassesList'], type: 'all' });
                            }}
                            addExcelFunc={() =>
                                openPopup(popupType.REGULAR, {
                                    title: studentsTable.addPopUp.addExcel,
                                    content: <ExcelStudentsPopUp />,
                                })
                            }
                        />
                    }
                    dropdownFilters={!classDetails ? dropdownFilters : []}
                    navigationFunction={(id, StudentRow) => {
                        navigate(`/admin/students/${id}`, {
                            state: { StudentRow, classId: classDetails?.id },
                        });
                    }}
                    actionButtons={[
                        {
                            label: studentsTable.delete,
                            icon: <DeleteIcon color="primary" />,
                            onAction: async (selected, params) => confirmDeleteStudents(selected as string[], params),
                            shouldResetCheckboxes: true,
                        },
                        {
                            label: studentsTable.moveStudents,
                            icon: <ReplyIcon color="primary" />,
                            onAction: async (selected, params) => confirmMoveStudents(selected as string[], params),
                            shouldResetCheckboxes: true,
                        },
                    ]}
                />
            </div>
        </ErrorBoundary>
    );
};

export default StudentsPage;
