import React from 'react';

import { ActionParams, AdminTable, GenericColumn, useAlert } from '@hilma/forms';
import { CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useI18n } from '../../../i18n/mainI18n';

import SubTitleWithDivider from '../../common/components/SubTitleWithDivider';
import { formatDate } from '../../common/functions/formatTimestamp';

import { popupType } from '../../../common/enums/popUpType.enum';
import { GoodPoint } from '../../common/types/goodPoint.type';

import DeleteIcon from '@mui/icons-material/Delete';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import handHoldingHeart from '/images/handHoldingHeart.svg';

import DeletePopUp from '../../components/delete-popup/DeletePopUp';
import AddOrEditStudentPopUpContent from '../../components/studets-admin-table/add-student-pop-up/AddOrEditStudentPopUpContent';

import studentIcon from '/images/studentIcon.svg';
import ExportReportBtn from '../../common/components/ExportReportBtn';
import { adminQueryKeys, adminQueryKeysWithPrefix } from '../../common/consts/adminTableQueryKeys';
import '../../common/styles/adminTableStyle.scss';
import { StudentRow } from '../../common/types/table-type/row-interfaces';

import { defaultQueryConfig } from '../../../lib/react-query/config/queryConfig';
import './studentPage.scss';

/**
 * Student component.
 * Renders a page for managing a single student.
 * @component
 */
const StudentPage: React.FC = () => {
    // Retrieve the student ID from the URL params
    const { id } = useParams<{ id: string }>();

    const { openPopup } = usePopup();
    const navigate = useNavigate();
    const alert = useAlert();

    const queryClient = useQueryClient();

    //gets the tables data for knowing the amount of good points
    const tableGoodPointsData = queryClient.getQueryData<GoodPoint[]>(
        [`table-load-${adminQueryKeys.tableGoodPoints}-${id}`],
        { type: 'all' },
    );

    // Retrieve the edited content from the nav location state
    // (note: this is undefined when the user uses the url to get into the page)
    const { state: editContent }: { state: { studentRow: StudentRow; classId: number | undefined } } = useLocation();

    const { isLoading, isSuccess, data } = useQuery(['get-student-by-id', id], async () => {
        try {
            const res = await axios.get(`/api/student/get-student-by-id/${id}`);

            return res.data;
        } catch (error: any) {
            if ((error as AxiosError) && error.status == 404) {
                alert(error_i18n.studentNotFound, 'error');

                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            }
        }
    });

    // Use useI18n hook to retrieve translated strings and store them in variables
    const { studentsTable, general, alphabet, error_i18n } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            general: i18n.general,
            alphabet: i18n.alphabet,
            error_i18n: i18n.errors,
        };
    });

    // handle pop-up deletion
    async function handleGpDeletionConfirmation(selected: string[], params: ActionParams<GoodPoint>): Promise<void> {
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
                        await queryClient.invalidateQueries({ queryKey: ['goodPoints', Number(id)] });
                        await queryClient.invalidateQueries({ queryKey: ['students'], type: 'all' });
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

    const columns: GenericColumn<GoodPoint>[] = [
        {
            key: 'student',
            label: studentsTable.fullName,
            renderColumn(row) {
                return `${row.student?.firstName} ${row.student?.lastName}`;
            },
        },
        {
            key: 'id',
            label: studentsTable.classId,
            renderColumn(row) {
                return `${alphabet[row.student.class?.grade] || '-'}${row.student.class?.classIndex || '-'}`;
            },
        },
        {
            key: 'teacher',
            label: studentsTable.senderName,
            renderColumn(row) {
                return `${row.teacher?.firstName || ''} ${row.teacher?.lastName}`;
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
                                <span className="edit-title">{`${data?.firstName} ${data?.lastName}`}</span>

                                <ExportReportBtn
                                    queryPath="/api/student/create-students-report-xlsx"
                                    filename={`${general.goodPoints} - ${data?.firstName} ${data?.lastName}`}
                                    disabledBtn={tableGoodPointsData?.length == 0}
                                    title={studentsTable.exportReport}
                                    contentQuery={{ studentsIds: [data?.id], classId: data?.classId }}
                                />
                            </div>
                            <SubTitleWithDivider content={studentsTable.studentInfo} icon={studentIcon} />
                        </div>

                        <AddOrEditStudentPopUpContent
                            editContent={isLoading ? editContent.studentRow : data}
                            isEditMode
                            classId={editContent.classId}
                        />
                        <AdminTable<GoodPoint>
                            rowsPerPage={10}
                            id={`${adminQueryKeys.tableGoodPoints}-${id}`}
                            columns={columns}
                            rowsUrl={`/api/good-points/get-gp-of-student?studentId=` + id}
                            queryStaleTime={defaultQueryConfig.staleTime}
                            rowId="id"
                            extraHeader={
                                <SubTitleWithDivider
                                    content={studentsTable.receivedGoodPoints}
                                    icon={handHoldingHeart}
                                />
                            }
                            checkboxColumn={tableGoodPointsData?.length != 0}
                            noResultsText={general.noGoodPoints}
                            actionButtons={[
                                {
                                    label: studentsTable.delete,
                                    icon: <DeleteIcon color="primary" />,
                                    onAction: async (selected, params) =>
                                        handleGpDeletionConfirmation(selected as string[], params),
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

export default StudentPage;
