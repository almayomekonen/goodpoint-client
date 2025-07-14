import { Box } from '@mui/material';
import clsx from 'clsx';
import { FC } from 'react';
import './checkbox.scss';
interface props {
    className?: string;
    isChecked: boolean;
    onCheck: () => void;
    label?: string;
}

export const CheckBox: FC<props> = ({ className, isChecked, onCheck, label }) => {
    return (
        <div className="checkbox-stack">
            {label && (
                <label className="checkbox-label" onClick={onCheck}>
                    {' '}
                    {label}
                </label>
            )}

            <Box
                component={'button'}
                tabIndex={0}
                onClick={(e) => {
                    e.stopPropagation();
                    onCheck();
                }}
                className={clsx('checkbox-button', className, { checked: isChecked })}
            >
                {isChecked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="checked-icon"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                )}
            </Box>
        </div>
    );
};
