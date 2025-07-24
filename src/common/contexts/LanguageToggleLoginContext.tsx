import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Language } from '../../i18n/init-i18n';
import { DEFAULT_LANG } from '../../i18n/i18n-consts';

const languageToggleLoginContext = createContext<{
    language: Language;
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}>({ language: DEFAULT_LANG, setLanguage: () => {} });

/**
 * Provider component for Language Toggle Login Context.
 * used in route therefore outlet is being used.
 * @returns {JSX.Element}
 */
export const LanguageToggleLoginProvider = () => {
    /**
     * The initial value is empty string
     * because we want the language settings in the interface to change
     * only if the user has changed language. If he didn't change the state should be false.
     */
    const [language, setLanguage] = useState<Language>(DEFAULT_LANG);

    return (
        <languageToggleLoginContext.Provider value={{ language, setLanguage }}>
            <Outlet />
        </languageToggleLoginContext.Provider>
    );
};
export const useLanguageToggle = () => useContext(languageToggleLoginContext);
