import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGroupMessage } from '../../common/contexts/GroupMessageContext';
import TitledHeader from '../../components/titled-header/TitledHeader';
import { useI18n } from '../../i18n/mainI18n';
import { SendingGoodPointList } from '../sending-good-point-list/SendingGoodPointList';

/**
 * Component for sending good points on mobile.
 * Renders the sending good point list.
 * @returns {JSX.Element} - SendGpMobile component JSX element.
 */
export const SendGpMobile = () => {
    const navigate = useNavigate();
    const { isGroupSending, setIsGroupSending } = useGroupMessage();
    const i18n = useI18n((i) => {
        return {
            sendingGpListTexts: i.sendingGoodPointList,
        };
    });

    function handleBackButton() {
        if (isGroupSending) setIsGroupSending(false);
        else navigate('/', { replace: true });
    }

    return (
        <Box className="titled-page">
            <TitledHeader
                size="small"
                onNavigate={() => handleBackButton()}
                icon={isGroupSending ? 'clear' : 'back'}
                title={i18n.sendingGpListTexts.addingGoodPoint}
            />
            <Box width={'100vw'} height={'87vh'}>
                <SendingGoodPointList />
            </Box>
        </Box>
    );
};
