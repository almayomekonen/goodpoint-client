import React from 'react';

import { Box, Divider, SxProps, Theme, Typography } from '@mui/material';

import './subTitleWithDivider.scss';

interface SubTitleWithHrProps {
    content: string;
    icon: string;
    containerSx?: SxProps<Theme>;
}
/**
 * SubTitleWithHr component displays a title with an icon and a divider
 * @param {string} content - The title text
 * @param {string} icon - The src icon to display next to the title
 * @returns {ReactNode} - The SubTitleWithHr component
 */

const SubTitleWithDivider: React.FC<SubTitleWithHrProps> = ({ content, icon, containerSx }) => {
    return (
        <>
            <Box className="divider-container" sx={containerSx}>
                <Typography component="span" className="divider-text">
                    <img src={icon} className="divider-Icon" alt="" />
                    <div className="divider-span-title">{content}</div>
                </Typography>
                <Divider component="div" className="divider-hr" role="presentation" />
            </Box>
        </>
    );
};

export default SubTitleWithDivider;
