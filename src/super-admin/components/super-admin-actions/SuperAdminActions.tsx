import { useAlert } from '@hilma/forms';
import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FC } from 'react';
import CustomAdminTableTitle from '../../../admin/components/admin-table-title/CustomAdminTableTitle';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import { useI18n } from '../../../i18n/mainI18n';

import './super-admin-actions.scss';

/** This component is used to display the actions that the super admin can do.
 * Like starting a new year, uploading students, etc.
 *
 */
export const SuperAdminActions: FC = () => {
    const i18n = useI18n((i18n) => {
        return {
            adminTobBar: i18n.adminTopBar,
            general: i18n.general,
            actions: i18n.superAdmin.actions,
        };
    });

    const { openPopup } = usePopup();
    const alert = useAlert();

    const { mutateAsync: gradeUp } = useMutation(
        ['grades-up'],
        async () => {
            await axios.post('/api/admin/start-new-year', {});
            alert(i18n.actions.gradesUpSuccess, 'success');
        },
        {
            onError: () => {
                alert(i18n.general.errorMessage, 'error');
            },
        },
    );

    function openUploadStudentsPopup() {
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.actions.studentsUpGrade,
            content: i18n.actions.gradeUpPopup,
            checkboxText: i18n.actions.yesAndIKnow,
            checkboxWarning: i18n.actions.checkboxWarning,
            okayText: i18n.general.accept,
            cancelText: i18n.general.cancel,
            containerClassName: 'actions-popup',
            showLoading: true,
            onConfirm: gradeUp,
        });
    }

    return (
        <div className="super-admin-actions admin-table-container">
            <CustomAdminTableTitle title={i18n.adminTobBar.actions} />
            <div className="actions-stack">
                <div className="super-admin-actions__action">
                    <Button
                        variant="contained"
                        className="super-admin-actions__action-button"
                        onClick={openUploadStudentsPopup}
                    >
                        {i18n.actions.studentsUpGrade}
                    </Button>

                    <p className="super-admin-actions__description">
                        {i18n.actions.studentsUpGradeText}
                        <b>
                            <br />
                            {i18n.actions.cannotUndo}
                        </b>
                    </p>
                </div>
            </div>
        </div>
    );
};
