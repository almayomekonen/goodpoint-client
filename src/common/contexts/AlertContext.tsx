import React, { FC, createContext, useContext, useState } from 'react';
import { AlertColor, Box, Snackbar, SnackbarContent } from '@mui/material';
import AlertStyles from '../styles/alert.module.scss';
import CheckIcon from '@mui/icons-material/Check';
import { isDesktop } from '../functions/isDesktop';

interface AlertProps {
    message: string;
    type?: AlertColor;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'success' }) => {
    return (
        <Box display="flex" gap="1rem" alignItems="center" className="alert-container">
            {type !== 'error' && <CheckIcon fontSize="medium" />}
            <div className={AlertStyles.message}>{message}</div>
        </Box>
    );
};

const PopupContext = createContext<(message: string, type: AlertColor) => void>(() => {});
interface Props {
    children: React.ReactNode;
}

/**
 * Alert component that displays a message with an optional icon.
 * @param message - The message to be displayed.
 * @param type - The type of alert (default: 'success').
 * @example 
 *     const alert = useAlert()
 * 
 *     // Example 1: Showing a success alert
 *     alert('Action completed successfully!', 'success');
 * 
 *     // Example 2: Showing a warning alert
 *     alert('Warning: There might be a problem.', 'error');

 */

export const AlertProvider: FC<Props> = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = useState<string>('');
    const [type, setType] = useState<AlertColor>('success');

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function alert(message: string, type: AlertColor) {
        setText(message);
        setOpen(true);
        setType(type);
    }

    return (
        <PopupContext.Provider value={alert}>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: isDesktop() ? 'top' : 'bottom', horizontal: 'center' }}
                sx={isDesktop() ? {} : { bottom: { xs: 55, sm: 0 }, margin: 0 }}
            >
                <SnackbarContent
                    className={AlertStyles.snackContainer}
                    message={<Alert type={type} message={text} />}
                    sx={{ backgroundColor: `${type === 'error' ? '#D32F2F' : '#081D5A'}` }}
                />
            </Snackbar>
            {children}
        </PopupContext.Provider>
    );
};

export const useAlert = () => useContext(PopupContext);
