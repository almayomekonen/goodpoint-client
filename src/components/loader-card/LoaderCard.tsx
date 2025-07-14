import { Box, Skeleton } from '@mui/material';
import React, { FC } from 'react';
import './loader-card.scss';
interface props {
    type: 'user-card' | 'nav-bar-icon';
}

export const LoaderCard: FC<props> = (props) => {
    switch (props.type) {
        case 'user-card':
            return (
                <Box className="loading-user-card user-card-container ">
                    <Skeleton variant="circular" width="4rem" height="4rem"></Skeleton>
                    <Skeleton width="50vw" height="3rem" variant="text"></Skeleton>
                </Box>
            );
        case 'nav-bar-icon':
            return <Skeleton width="30vw" height="5vh" variant="rounded"></Skeleton>;
    }
};
