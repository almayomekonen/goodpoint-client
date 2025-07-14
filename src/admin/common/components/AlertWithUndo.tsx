import React, { useEffect, useRef, useState } from 'react';

import { Button, CircularProgress } from '@mui/material';
import { useCloseAlert } from '@hilma/forms';

import { useI18n } from '../../../i18n/mainI18n';

import './AlertWithUndo.scss';

interface AlertWithUndoProps {
    message: string;
    onAction: () => void;
    buttonMessage?: string;
}
/**
 * AlertWithUndo is a component that displays an alert message with an undo button and a progress indicator.
 * @component
 * @param {string} message - The message to be displayed in the alert.
 * @param {Function} onAction - The function to be called when the action is performed (e.g., delete, confirm).
 * @param {string} buttonMessage - The text to be displayed on the undo button.
 * @returns {JSX.Element} A React element representing the AlertWithUndo component.
 */
const AlertWithUndo: React.FC<AlertWithUndoProps> = ({ message, onAction, buttonMessage }) => {
    const [progress, setProgress] = useState<number>(10);
    const closeAlert = useCloseAlert();
    const undoDelete = useRef(false);

    // translated strings
    const general = useI18n((i18n) => i18n.general);

    useEffect(() => {
        const timeout = 3500;

        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 20));
        }, timeout / 5);

        setTimeout(() => {
            if (!undoDelete.current) onAction();
        }, timeout + 300);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    /**
     * Event handler for the 'beforeunload' event that is triggered when the window is about to be unloaded.
     *
     * @param {BeforeUnloadEvent} event - The 'beforeunload' event object.
     * @returns {string} - A custom message to be displayed in the confirmation dialog.
     */
    function handleBeforeUnload(event: BeforeUnloadEvent) {
        event.preventDefault();
        // Display a custom message or confirmation dialog
        const message = general.areYouSureYouWantToLeaveThePage;
        event.returnValue = message; // Chrome requires this to be set
        return message; // All other browsers require this to be returned
    }

    function handleUndoClick() {
        undoDelete.current = true;
        closeAlert();
    }

    return (
        <div className="alert-with-undo">
            {message}
            <Button className="undo-btn" onClick={handleUndoClick}>
                {buttonMessage}
            </Button>
            <CircularProgress size={'1.5rem'} color="inherit" variant="determinate" value={progress} />
        </div>
    );
};
export default AlertWithUndo;
