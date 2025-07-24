import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, IconButton, Snackbar } from '@mui/material';
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '../../i18n/mainI18n';

/**
 * For updating the PWA version.
 *
 * * Installing the site as a PWA is done in AddToHomePagePopup.tsx component
 *
 * ([vite docs](https://vite-pwa-org.netlify.app/frameworks/react.html))
 */
function PWAReloadPrompt() {
    const { newVersion, reload } = useI18n((i) => i.general.pwa);

    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({});

    const handleRefresh = () => {
        updateServiceWorker(true);
    };

    const close = () => {
        setNeedRefresh(false);
    };

    const action = (
        <div>
            <Button color="secondary" size="small" onClick={handleRefresh}>
                {reload}
            </Button>

            <IconButton size="small" aria-label="close" color="inherit" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" />
            </IconButton>
        </div>
    );

    return (
        <Snackbar open={needRefresh} autoHideDuration={10000} onClose={close} message={newVersion} action={action} />
    );
}

export default PWAReloadPrompt;
