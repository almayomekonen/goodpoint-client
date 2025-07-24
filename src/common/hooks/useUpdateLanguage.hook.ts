import { useIsAuthenticated } from './useFirebaseAuthHooks';
import apiClient from '../../api/config';
import { Language } from '../../i18n/init-i18n';
import { useChangeLanguage } from '../../i18n/mainI18n';
import { useUser } from '../contexts/UserContext';

export const useUpdateLanguage = () => {
    const { setUser } = useUser();
    const changeLang = useChangeLanguage();
    const isAuthenticated = useIsAuthenticated();

    const updateLanguage = (preferredLanguage?: Language) => {
        if (!preferredLanguage) preferredLanguage = changeLang() as Language;

        if (isAuthenticated) {
            apiClient.put('/api/staff/update-preferred-language', { preferredLanguage });
            // optimistic view - we rather the client to change regardless of the situation in the server
            setUser((prev) => ({ ...prev, preferredLanguage: preferredLanguage }));
        }

        changeLang(preferredLanguage as Language);
        return preferredLanguage;
    };

    return updateLanguage;
};
