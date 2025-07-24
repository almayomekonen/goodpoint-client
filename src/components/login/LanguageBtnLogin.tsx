import clsx from 'clsx';
import { useLanguageToggle } from '../../common/contexts/LanguageToggleLoginContext';
import { getLanguageName } from '../../common/functions/getLanguageName';
import { isDesktop } from '../../common/functions/isDesktop';
import { Language } from '../../i18n/init-i18n';
import { useLanguage } from '../../i18n/mainI18n';

import LanguageIcon from '@mui/icons-material/Language';
import { Button } from '@mui/material';
import Cookies from 'js-cookie';

import { useUpdateLanguage } from '../../common/hooks/useUpdateLanguage.hook';
import './languageBtnLogin.scss';

export const LanguageBtnLogin = () => {
    const desktop = isDesktop();
    const updateLang = useUpdateLanguage();

    const lang = useLanguage();

    const { setLanguage } = useLanguageToggle();

    const changeLanguage = () => {
        const newLang = updateLang();
        Cookies.set('lang', newLang);
        setLanguage(newLang);
    };

    return (
        <div className={clsx(desktop && 'lang-btn-desktop')}>
            <Button className="lang" onClick={() => changeLanguage()}>
                <LanguageIcon />
                {desktop && <span>{getLanguageName(lang as Language)}</span>}
            </Button>
        </div>
    );
};
