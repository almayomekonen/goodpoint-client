import { ActionParams, AdminTable, GenericColumn, useAlert } from '@hilma/forms';
import { Button, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { useI18n } from '../../../i18n/mainI18n';
import { defaultQueryConfig } from '../../../lib/react-query/config/queryConfig';

import SubTitleWithDivider from '../../common/components/SubTitleWithDivider';
import { formatDate } from '../../common/functions/formatTimestamp';

import { popupType } from '../../../common/enums/popUpType.enum';
import { adminQueryKeys, adminQueryKeysWithPrefix } from '../../common/consts/adminTableQueryKeys';
import { GoodPoint } from '../../common/types/goodPoint.type';

import DeleteIcon from '@mui/icons-material/Delete';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import handHoldingHeart from '/images/handHoldingHeart.svg';

import LockResetIcon from '@mui/icons-material/LockReset';
import { UserInfoContextType } from '../../../common/contexts/UserContext';
import { useDeleteTeachers } from '../../../common/hooks/UseDeleteTeachers';
import studentIcon from '/images/studentIcon.svg';
import ExportReportBtn from '../../common/components/ExportReportBtn';
import DeletePopUp from '../../components/delete-popup/DeletePopUp';
import AddTeacherPopUp from '../../components/teachers-admin-table/add-pop-teacher/AddTeacherPopUp';
import { SuccessAddingTeacherPopup } from '../../components/teachers-admin-table/add-pop-teacher/SuccessAddingTeacherPopup';

import '../../common/styles/adminTableStyle.scss';
import '../student/studentPage.scss';

/**
 * Teacher component.
 * Renders a page for managing a single teacher.
 * @component
 */
const TeacherPage: React.FC = () => {
    // Retrieve the student ID from the URL params
    const { id } = useParams<{ id: string }>();

    const { openPopup } = usePopup();
    const navigate = useNavigate();
    const alert = useAlert();

    const queryClient = useQueryClient();
    //fetches the tables data for knowing the amount of good points
    const tableGoodPointsData = queryClient.getQueryData<GoodPoint[]>([
        `table-load-${adminQueryKeys.tableGoodPoints}-${id}`,
    ]);

    const { isLoading, isSuccess, data } = useQuery<UserInfoContextType, AxiosError, any>(
        ['admin-get-teacher', id],
        async () => {
            const res = await axios.get(`/api/staff/get-teacher/${id}`);
            return res.data;
        },
        {
            onError: (error) => {
                if (error?.response?.status === 404 || error.status === 404) {
                    alert(error_i18n.teacherNotFound, 'error');

                    setTimeout(() => {
                        navigate(-1);
                    }, 1500);
                }
            },
        },
    );

    // Use useI18n hook to retrieve translated strings and store them in variables
    const { studentsTable, general, teachersTable, error_i18n, gradesList } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            general: i18n.general,
            error_i18n: i18n.errors,
            teachersTable: i18n.teachersTable,
            gradesList: i18n.schoolGrades.gradesList,
        };
    });

    const deleteTeacher = useDeleteTeachers();

    // handle pop-up deletion
    async function confirmDeleteGP(selected: string[], params: ActionParams<GoodPoint>): Promise<void> {
        // I show the "Are you sure?" popup
        openPopup(popupType.ARE_U_SURE, {
            title: general.areYouSure,
            content: (
                <DeletePopUp
                    allChecked={params.allChecked}
                    selected={selected}
                    count={params.selectedAmount!}
                    categoryTitle={studentsTable.deletePopUp.goodPoints}
                    onDelete={async () => {
                        await deleteGP(selected, params);
                        await queryClient.invalidateQueries({
                            queryKey: [`${adminQueryKeysWithPrefix.goodPoint}-${id}`],
                        });
                    }}
                />
            ),
            deleting: true,
        });
    }

    async function deleteGP(selected: string[], params: { allChecked: boolean; userSearch?: string }) {
        try {
            const { allChecked, userSearch } = params;

            // Make API call to delete the selected students
            const { data } = await axios.delete('/api/good-points/delete-good-point', {
                data: {
                    all: allChecked,
                    selected,
                    studentId: id,
                },
                params: {
                    selected,
                    q: userSearch,
                },
            });
            alert(`${general.deletedSuccessfully} ${data} ${general.goodPoints} `, 'success');
        } catch (error: unknown) {
            alert(general.errorMessage, 'error');
        }
    }

    function handleResetPassword() {
        openPopup(popupType.ARE_U_SURE, {
            title: teachersTable.resetPassword,
            content: (
                <div className="reset-password-content">
                    {`${teachersTable.resetPasswordSure}${data.firstName} ${data.lastName}?`}
                </div>
            ),
            onConfirm: resetPassword,
            okayText: teachersTable.reset,
            cancelText: general.cancel,
        });
    }

    async function resetPassword() {
        try {
            const res = await axios.put(`/api/staff/reset-password-by-admin/${id}`);
            if (!res) throw new Error("Couldn't reset password");
            openPopup(popupType.REGULAR, {
                title: teachersTable.resetPassword,
                content: <SuccessAddingTeacherPopup newPassword={res.data.password} />,
            });
        } catch (error: unknown) {
            alert(general.errorMessage, 'error');
        }
    }

    const columns: GenericColumn<GoodPoint>[] = [
        {
            key: 'student',
            label: studentsTable.fullName,
            renderColumn(row) {
                return `${row.student.firstName} ${row.student.lastName}`;
            },
        },
        {
            key: 'id',
            label: studentsTable.classId,
            renderColumn(row) {
                return `${gradesList[row.student.class.grade]}${row.student.class.classIndex}`;
            },
        },
        {
            key: 'teacher',
            label: studentsTable.senderName,
            renderColumn(row) {
                return `${row.teacher.firstName} ${row.teacher.lastName}`;
            },
        },
        {
            key: 'created',
            label: general.date,
            renderColumn(row) {
                return formatDate(row.created);
            },
        },
        {
            key: 'gpText',
            label: general.goodPoints,
        },
    ];

    return (
        <>
            <ErrorBoundary fallback={<div>{error_i18n.somethingWentWrong}</div>}>
                {isSuccess ? (
                    <div className="student-page-container">
                        <div className="title-header-area">
                            <div className="title-header-with-side-btn">
                                <span className="edit-title">{`${data.firstName} ${data.lastName}`}</span>
                                <div className="side-btn">
                                    <Button
                                        className="delete-teacher"
                                        onClick={() =>
                                            deleteTeacher(
                                                [String(id)],
                                                { allChecked: false, filters: [], selectedAmount: 1 },
                                                `${data?.firstName} ${data?.lastName}`,
                                            )
                                        }
                                        variant="contained"
                                    >
                                        {studentsTable.delete}
                                        <DeleteIcon color="primary" />
                                    </Button>

                                    <ExportReportBtn
                                        queryPath="/api/staff/create-teacher-report-xlsx"
                                        filename={`${general.goodPoints} - ${data?.firstName} ${data?.lastName}`}
                                        disabledBtn={isLoading ? true : tableGoodPointsData?.length == 0}
                                        title={teachersTable.exportReport}
                                        contentQuery={{ teacherId: id }}
                                    />

                                    <Button
                                        className="reset-password"
                                        onClick={handleResetPassword}
                                        variant="contained"
                                    >
                                        {teachersTable.resetPassword}
                                        <LockResetIcon />
                                    </Button>
                                </div>
                            </div>
                            <SubTitleWithDivider content={teachersTable.teacherInfo} icon={studentIcon} />
                        </div>

                        <AddTeacherPopUp editContent={data} editMode />
                        <AdminTable<GoodPoint>
                            rowsPerPage={10}
                            id={`${adminQueryKeys.tableGoodPoints}-${id}`}
                            columns={columns}
                            rowsUrl={`/api/good-points/get-teacher-gps?teacherId=` + id}
                            queryStaleTime={defaultQueryConfig.staleTime}
                            rowId="id"
                            extraHeader={
                                <SubTitleWithDivider content={teachersTable.goodPointSent} icon={handHoldingHeart} />
                            }
                            checkboxColumn={tableGoodPointsData?.length != 0}
                            noResultsText={general.noGoodPoints}
                            actionButtons={[
                                {
                                    label: studentsTable.delete,
                                    icon: <DeleteIcon color="primary" />,
                                    onAction: async (selected, params) => confirmDeleteGP(selected as string[], params),
                                    shouldResetCheckboxes: true,
                                },
                            ]}
                            disablePagination={tableGoodPointsData?.length == 0}
                        />
                    </div>
                ) : (
                    <div className="loading">
                        <CircularProgress />
                    </div>
                )}
            </ErrorBoundary>
        </>
    );
};

export default TeacherPage;
