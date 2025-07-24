import clsx from 'clsx';
import { FormSubmitButton } from '@hilma/forms';
import { useI18n } from '../../../i18n/mainI18n';
import { FC } from 'react';
import Button from '@mui/material/Button';
import './adminPopupFormButtons.scss';

interface AdminPopupFormButtons {
    handleClose: () => void;
    addOrUpdate: 'add' | 'update';
}

/**
 * AdminPopupFormButtons is a generic component that renders the buttons for an admin popup.
 * @component
 * @param {Function} handleClose - The function to handle closing the popup.
 * @param {'add' | 'update'} addOrUpdate - Specifies whether the form is for adding or updating data.
 * @returns {JSX.Element} A React element representing the AdminPopupFormButtons component.
 */
const AdminPopupFormButtons: FC<AdminPopupFormButtons> = ({ handleClose, addOrUpdate }) => {
    const { general } = useI18n((i18n) => {
        return { general: i18n.general };
    });

    return (
        <div className="admin-popup-buttons-container">
            <Button className={clsx('tab', 'cancel')} onClick={handleClose} variant="outlined">
                {general.cancel}
            </Button>

            <FormSubmitButton className={clsx('tab', 'accept')} variant="contained">
                {general[addOrUpdate]}
            </FormSubmitButton>
        </div>
    );
};

export default AdminPopupFormButtons;
