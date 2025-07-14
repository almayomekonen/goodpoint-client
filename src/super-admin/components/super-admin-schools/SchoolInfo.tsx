import { useEffect, useState } from 'react';
import LockResetIcon from '@mui/icons-material/LockReset';
import { AdminTable, GenericColumn, useAlert } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import BackArrowIcon from '@mui/icons-material/EastRounded';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertWithUndo from '../../../admin/common/components/AlertWithUndo';
import { adminQueryKeys } from '../../../admin/common/consts/adminTableQueryKeys';
import { AdminRow } from '../../../admin/common/types/table-type/row-interfaces/adminRow.interface';
import AddButtons from '../../../admin/components/add-buttons/AddButtons';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { SchoolGrades } from '../../../common/enums';
import { popupType } from '../../../common/enums/popUpType.enum';
import GenericPopup from '../../../components/generic-popup/GenericPopup';
import { useI18n } from '../../../i18n/mainI18n';
import { useDeleteAdmin } from '../../../lib/react-query/hooks/useSuperAdminSchools';
import AddAdminForm from './AddAdminForm';

import './school-info.scss';
import { SuccessAddingTeacherPopup } from '../../../admin/components/teachers-admin-table/add-pop-teacher/SuccessAddingTeacherPopup';

type SchoolGradeType =
    | 'elementarySchool'
    | 'middleSchool'
    | 'highSchool'
    | 'highMiddleSchool'
    | 'elementaryAndMiddleSchool'
    | 'elementaryAndHighSchool';

export type ExtraSchoolInfo = {
    numOfTeachers: number;
    schoolType: SchoolGradeType;
    schoolRange: {
        smallestGrade: SchoolGrades;
        biggestGrade: SchoolGrades;
    };
    teachersGpCount: number;
    studentsGpCount: number;
};

/** This component is used to display a specific school's info  , like the admins of the school, and basic details about the school.
 *
 * the id of the school is passed in the location state
 */
export const SchoolInfo = () => {
    //states
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    //state for the admin that is selected for deletion

    //getting school info from the location state
    const {
        state: { name, numOfStudents, schoolId },
    } = useLocation();
    useEffect(() => {
        //navigating back to schools page in case of error in page state
        if (!schoolId) navigate('/super-admin/schools');
    }, []);

    const navigate = useNavigate();
    const showAlert = useAlert();
    const { openPopup } = usePopup();
    const { mutate: deleteAdmin } = useDeleteAdmin(schoolId);

    //translations
    const i18n = useI18n((i) => {
        return {
            general: i.general,
            superAdmin: i.superAdmin,
            actions: i.superAdmin.actions,
        };
    });

    const { general, teachersTable } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            general: i18n.general,
            error_i18n: i18n.errors,
            teachersTable: i18n.teachersTable,
            gradesList: i18n.schoolGrades.gradesList,
        };
    });

    //fetching school info by id
    const { data: extraSchoolInfo, isFetching } = useQuery<ExtraSchoolInfo>(['schoolInfo', schoolId], async () => {
        const { data } = await axios('/api/schools/get-extra-school-info', {
            params: { schoolId: schoolId },
            method: 'GET',
        });
        return data;
    });

    const columns: GenericColumn<AdminRow>[] = [
        {
            key: 'firstName',
            label: i18n.superAdmin.firstName,
        },
        {
            key: 'lastName',
            label: i18n.superAdmin.lastName,
        },
        {
            key: 'username',
            label: i18n.superAdmin.email,
        },
        {
            type: 'icon',
            key: 'id',
            renderColumn(row) {
                return (
                    <div className="school-info-admin-buttons">
                        <button
                            type="button"
                            onClick={() => {
                                handleResetPassword(row.id);
                            }}
                            className="delete-button clean-no-style-button"
                        >
                            <LockResetIcon />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                handleDeleteAdminClick(row.id);
                            }}
                            className="delete-button clean-no-style-button"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                );
            },
        },
    ];

    function handleDeleteAdminClick(adminId: string) {
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.superAdmin.deleteAdmin,
            checkboxText: i18n.superAdmin.iAmSureIWantToDeleteAdmin,
            checkboxWarning: i18n.actions.checkboxWarning,
            okayText: i18n.general.accept,
            cancelText: i18n.general.cancel,
            containerClassName: 'actions-popup delete-admin-popup',
            showLoading: true,
            onConfirm: () => handleDeleteAdmin(adminId),
        });
    }

    function handleDeleteAdmin(adminId: string) {
        showAlert(
            <AlertWithUndo
                message={i18n.superAdmin.deletingAdmin}
                onAction={() => {
                    try {
                        deleteAdmin({ adminId, schoolId });
                    } catch (e) {
                        showAlert(i18n.superAdmin.failedToDeleteAdmin, 'error');
                    }
                }}
                buttonMessage={i18n.general.cancel}
            />,
        );
    }

    function handleResetPassword(id: string) {
        openPopup(popupType.ARE_U_SURE, {
            title: teachersTable.resetPassword,
            content: (
                <div className="reset-password-content">{`${teachersTable.resetPasswordSure}${general.admin}?`}</div>
            ),
            onConfirm: () => resetPassword(id),
            okayText: teachersTable.reset,
            cancelText: general.cancel,
        });
    }

    async function resetPassword(id: string) {
        try {
            const res = await axios.put(`/api/staff/reset-password-by-admin/${id}`);
            if (!res) throw new Error("Couldn't reset password");
            openPopup(popupType.REGULAR, {
                title: teachersTable.resetPassword,
                content: <SuccessAddingTeacherPopup newPassword={res.data.password} />,
            });
        } catch (error: unknown) {
            showAlert(general.errorMessage, 'error');
        }
    }

    return (
        <>
            <div className="school-info-container admin-table-container">
                {/**school name */}
                <div className="school-info">
                    <Typography className="school-name">
                        {/**back button */}
                        <button onClick={() => navigate(-1)} className="school-info-back-button clean-no-style-button">
                            <BackArrowIcon className="school-info-back-icon" />
                        </button>
                        <span className="bold">{name}</span>
                        {extraSchoolInfo?.schoolType && ' -'}
                        <span>{extraSchoolInfo?.schoolType && i18n.superAdmin[extraSchoolInfo.schoolType]}</span>
                    </Typography>

                    {/**teachers and students count */}
                    <div className="admin-counts-container">
                        {isFetching &&
                            Array(4)
                                .fill(null)
                                .map((box, index) => <Skeleton key={index} />)}

                        {!isFetching && extraSchoolInfo && (
                            <>
                                <Box className="teachers-count-container">
                                    <p className="count-text count-number">{extraSchoolInfo.numOfTeachers}</p>
                                    <p className="count-text">{i18n.superAdmin.numOfTeachers}</p>
                                </Box>

                                <Box className="teachers-count-container">
                                    <p className="count-text count-number">{numOfStudents}</p>
                                    <p className="count-text">{i18n.superAdmin.numOfStudents}</p>
                                </Box>

                                <Box className="teachers-count-container">
                                    <p className="count-text count-number">{extraSchoolInfo.studentsGpCount}</p>
                                    <p className="count-text">{i18n.superAdmin.studentsGpCount}</p>
                                </Box>

                                <Box className="teachers-count-container">
                                    <p className="count-text count-number">{extraSchoolInfo.teachersGpCount}</p>
                                    <p className="count-text">{i18n.superAdmin.teachersGpCount}</p>
                                </Box>
                            </>
                        )}
                    </div>

                    <div className="school-admins-table">
                        <AdminTable<AdminRow>
                            id={`${adminQueryKeys.adminsTable}-${schoolId}`}
                            columns={columns}
                            rowsUrl={`/api/schools/get-schools-admin-table?schoolId=${schoolId}`}
                            title={i18n.superAdmin.adminList}
                            rowId="id"
                            extraHeader={
                                <AddButtons
                                    showExcelButton={false}
                                    addText={i18n.superAdmin.addAdmin}
                                    addFunc={() => {
                                        setIsAddAdminModalOpen(true);
                                    }}
                                />
                            }
                        />
                    </div>
                </div>

                {/**add admin modal */}
                <GenericPopup
                    containerClassName="super-admin-generic-popup add-admin-modal"
                    clearIcon
                    open={isAddAdminModalOpen}
                    title={''}
                    onCancel={() => setIsAddAdminModalOpen(false)}
                    isForm
                >
                    <AddAdminForm
                        schoolId={schoolId}
                        setIsAddAdminModalOpen={setIsAddAdminModalOpen}
                        closePopup={() => setIsAddAdminModalOpen(false)}
                    />
                </GenericPopup>
            </div>
        </>
    );
};
