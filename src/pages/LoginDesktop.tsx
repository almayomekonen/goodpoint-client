import { useState } from 'react';
import { useI18n } from '../i18n/mainI18n';
import clsx from 'clsx';
import { pagesImgSrc } from '../common/consts/pagesImagesSrc.const';
import { HelmetTitlePage } from '../components/HelmetTitlePage';
import DesktopTopBar from '../components/desktop-top-bar/DesktopTopBar';
import { Login } from '../components/login/Login';
import { ChangePassword } from '../components/login/ChangePassword';
import { Button } from '@mui/material';
import logo from '/images/logo.svg';
import './loginDesktop.scss';

interface LoginDesktopProps {
    resetPassword?: boolean;
}

export const LoginDesktop = ({ resetPassword }: LoginDesktopProps) => {
    const i18n = useI18n((i18n) => ({ pagesTitles: i18n.pagesTitles, login: i18n.loginText }));

    const [firstLogin, setFirstLogin] = useState<boolean>(true);
    const [isFadingOut, setIsFading] = useState(false);

    function goToLogin() {
        setIsFading(true);

        setTimeout(() => {
            setFirstLogin(false);
            localStorage.setItem('notFirstLogin', 'true');
        }, 200);
    }

    const openingPage = firstLogin && !localStorage.getItem('notFirstLogin');

    return (
        <div className={clsx('login-desktop', !openingPage ? 'fade-in' : isFadingOut && 'fade-out')}>
            <HelmetTitlePage title={i18n.pagesTitles.login} />
            <DesktopTopBar />

            <div className={'login-desktop-wrapper'}>
                <div className={clsx('inputs-container', openingPage && 'first-login')}>
                    <img className="logo" src={logo} alt="" />

                    {openingPage ? (
                        <div className="text-first-login">
                            <span className="text">
                                {i18n.login.firstLoginText1}
                                <br />
                                {i18n.login.firstLoginText2} <br />
                                {i18n.login.firstLoginText3}
                            </span>
                            <Button data-cy="first-time-login-button" className="login-btn" onClick={goToLogin}>
                                {i18n.login.login}
                            </Button>
                        </div>
                    ) : resetPassword ? (
                        <ChangePassword />
                    ) : (
                        <Login />
                    )}
                </div>
            </div>

            <div className="left-side">
                {openingPage ? (
                    <img className="left-image-first-login" src={pagesImgSrc.firstLogin} alt="" />
                ) : (
                    <img className="left-image" src={pagesImgSrc.login} alt="" />
                )}
            </div>
        </div>
    );
};
