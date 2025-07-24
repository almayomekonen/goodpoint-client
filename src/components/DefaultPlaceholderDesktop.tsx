import { FC } from 'react';
import { useI18n } from '../i18n/mainI18n';
import { useSendGpModal } from '../common/contexts/SendGpModalContext';
import image from '/images/desktopImg.svg';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';
import './defaultPlaceholderDesktop.scss';

/**
 * Component for displaying a default placeholder on desktop view.
 * Shows an image and a button to send a good point.
 */
export const DefaultPlaceholderDesktop: FC = () => {
    const i18n = useI18n((i18n) => i18n.general);
    const { setIsModalOpen } = useSendGpModal();

    return (
        <div className="home-image-desktop">
            <img src={image} alt="" className="default-image" />
            <Button
                className="btn-add-gp"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
            >
                {i18n.sendGp}
            </Button>
        </div>
    );
};
