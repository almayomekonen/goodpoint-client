import { useIsAuthenticated } from '@hilma/auth';
import { useEffect, useState } from 'react';
import { BeforeInstallPromptEvent } from '../../common/types/pwa-before-install-prompt.type';
import { useI18n } from '../../i18n/mainI18n';
import GenericPopup from '../generic-popup/GenericPopup';
import './addToHomePagePopup.scss';

let deferredPromptVar: null | BeforeInstallPromptEvent = null;

const AddToHomePagePopup = () => {
    const [isPromptSaved, setIsPromptSaved] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const i18n = useI18n((i18n) => ({ general: i18n.general }));

    const isDenied = localStorage.getItem('pwagp') === 'deny';

    useEffect(() => {
        function onBeforeInstallPrompt(e: Event) {
            setIsPromptSaved(true);
            // Stash the event so it can be triggered later.
            deferredPromptVar = e as BeforeInstallPromptEvent;
            if (!isAuthenticated) {
                // Prevent the mini-infobar from appearing
                e.preventDefault();
            }
        }
        function onAppInstalled() {
            // Clear the deferredPrompt so it can be garbage collected
            setIsPromptSaved(false);
            deferredPromptVar = null;
        }

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
            window.removeEventListener('appinstalled', onAppInstalled);
            // deferredPromptVar = null;
        };
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            setIsPromptSaved(true);
        }
    }, [isAuthenticated]);

    function onAccept() {
        isPromptSaved && deferredPromptVar && deferredPromptVar.prompt();
        setIsPromptSaved(false);
        deferredPromptVar = null;
    }

    function onCancel() {
        localStorage.setItem('pwagp', 'deny');
        setIsPromptSaved(false);
        deferredPromptVar = null;
    }

    const shouldOpen = isAuthenticated && isPromptSaved && !isDenied && !!deferredPromptVar?.prompt;

    return (
        <GenericPopup
            open={shouldOpen}
            title={i18n.general.betterExperience}
            acceptText={i18n.general.download}
            cancelText={i18n.general.notNow}
            containerClassName="home-page-popup"
            onAccept={onAccept}
            onCancel={onCancel}
        />
    );
};

export default AddToHomePagePopup;
