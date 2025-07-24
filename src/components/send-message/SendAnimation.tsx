import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { Status } from '../../common/types/status.types';
import { useAlert } from '../../common/contexts/AlertContext';
import { useI18n } from '../../i18n/mainI18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { isDesktop } from '../../common/functions/isDesktop';
import './sendAnimation.scss';

interface SendAnimteProps {
    status: Status;
    setSendGp: React.Dispatch<React.SetStateAction<boolean>>;
    textBoxWithPM?: boolean;
}
export default function SendAnimation({ status, setSendGp, textBoxWithPM }: SendAnimteProps) {
    const i18n = useI18n((i18n) => i18n.errors);
    const alert = useAlert();

    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        if (status === 'success') {
            if (textBoxWithPM) {
                navigate('', { state: { ...state, gpCount: state.gpCount + 1 }, replace: true });
            }
            setTimeout(() => {
                isDesktop() ? navigate('gp-sent') : navigate('/gp-sent', { replace: true });
            }, 750);
        }

        if (status === 'error') {
            alert(i18n.noSendMessage || 'שגיאה. ההודעה לא נשלחה', 'error');
            setSendGp(false);
        }
    }, [status]);

    return (
        <div className="sendAnimation">
            {status === 'loading' && (
                <Box>
                    <CircularProgress className="circle" thickness={2} size={30} variant="indeterminate" />
                </Box>
            )}
        </div>
    );
}
