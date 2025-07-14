import { FC } from 'react';
import './OvalWithX.scss';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

interface OvalWithXProps {
    text: string;
    onClick: () => void;
}

// A ui component with text and x on the side
export const OvalWithX: FC<OvalWithXProps> = ({ onClick, text }) => {
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            onClick();
        }
    }
    return (
        <span tabIndex={0} onKeyDown={handleKeyDown} className="oval-main-wrapper flex-center">
            <span className="text">{text}</span>
            <IconButton tabIndex={-1} onClick={onClick}>
                <CloseIcon className="close-icon" />
            </IconButton>
        </span>
    );
};
