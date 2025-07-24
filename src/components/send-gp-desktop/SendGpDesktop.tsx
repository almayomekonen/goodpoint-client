import ClearIcon from '@mui/icons-material/Clear';
import { Modal } from '@mui/material';
import { useGroupMessage } from '../../common/contexts/GroupMessageContext';
import { useSendGpModal } from '../../common/contexts/SendGpModalContext';
import { SendingGoodPointList } from '../../pages/sending-good-point-list/SendingGoodPointList';

import './send-gp-desktop.scss';

/**
 * This component displays the send gp modal that allows the user to send a gp to another user
 *
 */
export const SendGpDesktop = () => {
    const { setIsModalOpen, isModalOpen } = useSendGpModal();
    const { isGroupSending, setIsGroupSending } = useGroupMessage();
    function closeModal(isXButton?: boolean) {
        //if button clicked , then only close modal if not group sending
        if ((isXButton && !isGroupSending) || !isXButton) setIsModalOpen(false);

        setIsGroupSending(false);
    }

    return (
        <Modal keepMounted open={isModalOpen} onClose={() => closeModal()}>
            <div className="send-gp-desktop-container send-gp-desktop-modal">
                {/* X icon */}
                <button className="clean-no-style-button send-gp-clear-button" onClick={() => closeModal(true)}>
                    <ClearIcon className="send-gp-clear-icon" />
                </button>

                {/*the students list */}
                <SendingGoodPointList />
            </div>
        </Modal>
    );
};
