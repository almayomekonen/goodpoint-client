import { SwipeableDrawer } from '@mui/material';
import { useReactionModal } from '../../common/contexts/ReactionModalContext';
import { Reactions } from '../reactions/Reactions';
import './emojis-modal.scss';

export const EmojisModal = () => {
    const { isOpen, setIsOpen } = useReactionModal();

    return (
        <SwipeableDrawer
            className="emojis-modal-container"
            anchor="bottom"
            open={isOpen}
            onOpen={() => {}}
            onClose={() => {
                setIsOpen(false);
            }}
            disableSwipeToOpen={true}
            ModalProps={{
                keepMounted: false,
            }}
        >
            <Reactions isMobile={true} />
        </SwipeableDrawer>
    );
};
