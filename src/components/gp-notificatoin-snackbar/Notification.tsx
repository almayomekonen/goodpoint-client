import { Snackbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGpsSocket } from '../../common/contexts/GpSocketContext';
import { usePopup } from '../../common/contexts/PopUpProvider';
import { hideNotificationPaths } from '../../common/consts/hide-notification-paths';
import { popupType } from '../../common/enums/popUpType.enum';
import { useSwitchSchool } from '../../common/hooks/useSwitchSchool';
import { useI18n } from '../../i18n/mainI18n';

import './notification.scss';
import { useUser } from '../../common/contexts/UserContext';

export const Notification = () => {
    const navigate = useNavigate();
    const i18 = useI18n((i) => i.general);
    const { openPopup } = usePopup();
    const { setDifferentSchoolId, didReceiveMessage, setDidReceiveMessage, messageReceived, differentSchoolId } =
        useGpsSocket();
    const { pathname } = useLocation();
    const switchSchool = useSwitchSchool();
    const { user } = useUser();

    function handleNotificationClick() {
        if (differentSchoolId && differentSchoolId != user.currSchoolId) {
            openPopup(popupType.ARE_U_SURE, {
                title: i18.theGpIsFromDifferentSchool,
                onConfirm: moveToDifferentSchool,
                okayText: i18.accept,
                cancelText: i18.cancel,
            });
        } else {
            navigate('/received-good-points', { state: { gpId: messageReceived.gpId } });
        }
        setDidReceiveMessage(false);
    }

    async function moveToDifferentSchool() {
        if (differentSchoolId) await switchSchool(differentSchoolId);
        setDifferentSchoolId(null);

        navigate('/received-good-points', { state: { gpId: messageReceived.gpId } });
    }

    return (
        <Snackbar
            open={didReceiveMessage && !hideNotificationPaths.includes(pathname)}
            autoHideDuration={2000}
            onClose={() => setDidReceiveMessage(false)}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
            <button onClick={handleNotificationClick} className="received-gp-snackbar flex-center">
                <Typography textAlign="center">{i18.youReceivedAMessage}</Typography>
            </button>
        </Snackbar>
    );
};
