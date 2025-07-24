import ClearIcon from '@mui/icons-material/Clear';
import { Button, Dialog } from '@mui/material';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { CheckBox } from '../checkbox/CheckBox';
import { LoadingButton } from '../loading-button/LoadingButton';
import './generic-popup.scss';

interface props {
    open: boolean;
    title: string;
    content?: string;
    children?: React.ReactNode;
    cancelText?: string;
    acceptText?: string;
    onCancel?: () => void;
    onAccept?: () => void;
    clearIcon?: boolean;
    isForm?: boolean;
    containerClassName?: string;
    showButtons?: boolean;
    checkboxText?: string;
    checkboxWarning?: string;
    isLoading?: boolean;
}

const GenericPopup: FC<props> = ({
    open,
    isForm,
    title,
    content,
    cancelText,
    clearIcon,
    children,
    acceptText,
    onAccept,
    onCancel,
    containerClassName,
    checkboxText,
    checkboxWarning,
    isLoading,
}) => {
    const [isChecked, setIsChecked] = useState(false);
    const [showCheckWarning, setShowCheckWarning] = useState(false);

    function onAcceptClick() {
        if (checkboxText && !isChecked) {
            setShowCheckWarning(true);
        } else {
            onAccept && onAccept();
            setShowCheckWarning(false);
            setIsChecked(false);
        }
    }

    return (
        <Dialog
            open={open}
            disablePortal={!!isForm}
            className={clsx('generic-popup-container')}
            PaperProps={{
                className: containerClassName,
            }}
        >
            {clearIcon && (
                <button
                    data-cy={'close-popup'}
                    className={clsx('clear-icon', 'generic-popup-button')}
                    onClick={onCancel}
                >
                    <ClearIcon fontSize="large" />
                </button>
            )}

            {title && <div className="title">{title}</div>}

            {content && <div className="content">{content}</div>}

            {children && <div className="children"> {children}</div>}

            {checkboxText && (
                <>
                    <CheckBox
                        isChecked={isChecked}
                        onCheck={() => {
                            setIsChecked((val) => !val);
                            setShowCheckWarning(false);
                        }}
                        label={checkboxText}
                    />
                    {
                        <p
                            aria-hidden={!showCheckWarning}
                            className={clsx({ 'active-warning': showCheckWarning, 'checkbox-warning': true })}
                        >
                            {checkboxWarning}
                        </p>
                    }
                </>
            )}

            {cancelText || acceptText ? (
                <div className="buttons">
                    {cancelText && (
                        <Button
                            className={clsx('tab', 'cancel')}
                            onClick={() => {
                                setIsChecked(false);
                                setShowCheckWarning(false);
                                onCancel && onCancel();
                            }}
                            color="primary"
                            variant="outlined"
                        >
                            {cancelText}
                        </Button>
                    )}
                    {acceptText && (
                        <LoadingButton
                            className={clsx('tab', 'accept')}
                            onClick={onAcceptClick}
                            color="primary"
                            variant="contained"
                            loading={!!isLoading}
                        >
                            {acceptText}
                        </LoadingButton>
                    )}
                </div>
            ) : null}
        </Dialog>
    );
};

export default GenericPopup;
