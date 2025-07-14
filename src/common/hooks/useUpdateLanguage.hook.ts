import { useIsAuthenticated } from '@hilma/auth';
import axios from 'axios';
import { Language } from '../../i18n/init-i18n';
import { useChangeLanguage } from '../../i18n/mainI18n';
import { useUser } from '../contexts/UserContext';

/**
 *
 * @returns Updates user language function.
 *
 * The function updates i18n state, and if the user is authenticated it updates his language preferences.
 */
export const useUpdateLanguage = () => {
    const { setUser } = useUser();
    const changeLang = useChangeLanguage();
    const isAuthenticated = useIsAuthenticated();

    /**
     *
     * @param {Language} preferredLanguage - Selected language. If not specified, will toggle to the opposite language.
     * @returns Current language (after change)
     */
    const updateLanguage = (preferredLanguage?: Language) => {
        if (!preferredLanguage) preferredLanguage = changeLang() as Language;

        if (isAuthenticated) {
            axios.put('/api/staff/update-preferred-language', { preferredLanguage });
            // optimistic view - we rather the client to change regardless of the situation in the server
            setUser((prev) => ({ ...prev, preferredLanguage: preferredLanguage }));
        }

        changeLang(preferredLanguage as Language);
        return preferredLanguage;
    };

    return updateLanguage;
};
