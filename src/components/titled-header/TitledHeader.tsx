import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import BackArrowIcon from '@mui/icons-material/EastRounded';
import clsx from 'clsx';
import './titled-header.scss';

interface TitledHeaderProps {
    title?: string;
    size?: 'small' | 'medium' | 'large';
    icon?: 'clear' | 'back';
    children?: ReactNode; // When passing children title and icon are not displayed (and not required)
    onNavigate?: () => void;
}

/**
 * Represents the titled header component for mobile.
 *
 * @component
 * @param {string} [title] - The title of the header.
 * @param {('small' | 'medium' | 'large')} [size] - The size of the header.
 * @param {('clear' | 'back')} [icon] - The icon to display in the header.
 * @param {ReactNode} [children] - The children of the component.
 * @param {() => void} [onNavigate] - The function to be called when the icon is clicked.
 * @returns {JSX.Element} - The TitledHeader component.
 */
const TitledHeader: FC<TitledHeaderProps> = ({ title, icon, children, size = 'small', onNavigate }) => {
    return (
        <div className="titled-header-container">
            {/*<div className={clsx('white-background', `${size}-background`)}></div>*/}

            <Box className={clsx('header-area', `${size}-title`, children && 'display-block')}>
                {children ?? (
                    <>
                        {icon === 'clear' ? (
                            <ClearIcon onClick={onNavigate ? () => onNavigate() : undefined} className="delete-icon" />
                        ) : (
                            <BackArrowIcon
                                onClick={onNavigate ? () => onNavigate() : undefined}
                                className="delete-icon"
                            />
                        )}
                        <Typography className="titled-header-text">{title}</Typography>
                    </>
                )}
                <div className="left-invisible-div"></div>
            </Box>
        </div>
    );
};

export default TitledHeader;
