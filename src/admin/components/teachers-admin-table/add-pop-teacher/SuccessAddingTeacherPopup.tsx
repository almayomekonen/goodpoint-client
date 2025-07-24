import { Button } from '@mui/material';
import { usePopup } from '../../../../common/contexts/PopUpProvider';
import { useI18n } from '../../../../i18n/mainI18n';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAlert } from '@hilma/forms';
import './successAddingTeacherPopup.scss';
import { FC } from 'react';

interface SuccessAddingTeacherProps {
    newPassword?: string;
    isAdmin?: boolean;
}

/**

 * 
 */

/**
 * SuccessAddingTeacherPopup is a component that displays a success message after adding a teacher.
 *  After adding a teacher, if the teacher is new in the system - he receives a password through this popup,
 *  and if he already exists, he is just added to the current school.
 *
 * @component
 * @param {string} newPassword - The new password generated for the teacher.
 * @param {boolean} isAdmin - Specifies whether the user is an admin. Default is false.
 * @returns {JSX.Element} A React element representing the SuccessAddingTeacherPopup component.
 */

export const SuccessAddingTeacherPopup: FC<SuccessAddingTeacherProps> = ({ newPassword, isAdmin = false }) => {
    const { closePopup } = usePopup();
    const { teachersTable, superAdmin } = useI18n((i18n) => {
        return {
            teachersTable: i18n.teachersTable,
            superAdmin: i18n.superAdmin,
        };
    });

    const alert = useAlert();

    function copyToClipboard() {
        try {
            navigator.clipboard.writeText(newPassword!);
            alert(teachersTable.passwordCopied, 'success');
        } catch (error) {
            alert(teachersTable.passwordNoCopied, 'error');
        }
    }

    return (
        <div className="success-adding-teacher-popup">
            {newPassword ? (
                <div className="new-password">
                    {teachersTable.password}

                    <div className="password-and-copy">
                        {newPassword}

                        <Button className="copy-icon" onClick={copyToClipboard}>
                            <ContentCopyIcon />
                        </Button>
                    </div>

                    <span className="attention">{teachersTable.newPasswordAttention}</span>
                </div>
            ) : (
                <span className="new-password">{isAdmin ? superAdmin.userExists : teachersTable.teacherExists}</span>
            )}

            <Button className="close-btn" onClick={closePopup}>
                {teachersTable.submit}
            </Button>
        </div>
    );
};
