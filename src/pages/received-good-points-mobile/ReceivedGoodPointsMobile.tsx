import React from 'react';
import { Box } from '@mui/material';
import { ReceivedGoodPoints } from '../received-good-points/ReceivedGoodPoints';
import { useNavigate } from 'react-router-dom';
import TitledHeader from '../../components/titled-header/TitledHeader';
import { useI18n } from '../../i18n/mainI18n';

/**
 * Component: ReceivedGoodPointsMobile
 * ------------------------------------
 * This component represents the mobile version of the received good points page for teachers.
 * It displays a titled header and the received good points feed.
 *
 * @returns {JSX.Element} The ReceivedGoodPointsMobile component JSX element.
 */
export const ReceivedGoodPointsMobile = () => {
    const navigate = useNavigate();
    const i18n = useI18n((i) => i.teacherActivity);
    return (
        <Box className="titled-page">
            <TitledHeader onNavigate={() => navigate(-1)} icon={'clear'} title={i18n.myReceivedGoodPoints} />
            <div className="received-good-points-mobile fixed-dated-gps">
                <ReceivedGoodPoints />
            </div>
        </Box>
    );
};
