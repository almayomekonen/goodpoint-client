import { Box } from '@mui/material';
import { ReceivedGoodPoints } from '../../pages/received-good-points/ReceivedGoodPoints';
import '../dated-good-points-desktop.scss';
export const ReceivedGoodPointsDesktop = () => {
    return (
        <Box className="dated-gps-desktop-container">
            <Box className="dated-gps-desktop-received-gps">
                <ReceivedGoodPoints />
            </Box>
            <div className="flex-center dated-gps-desktop-image-container">
                <Box component={'img'} src="/images/artwork.svg" className="dated-gps-desktop-image" />
            </div>
        </Box>
    );
};
