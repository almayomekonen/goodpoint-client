import { HelmetTitlePage } from '../components/HelmetTitlePage';
import { ChangePassword } from '../components/login/ChangePassword';
import { LanguageBtnLogin } from '../components/login/LanguageBtnLogin';
import { Login } from '../components/login/Login';
import { useI18n } from '../i18n/mainI18n';
import './LoginMobile.scss';
import logo from '/images/logo/gplogo1.svg';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

interface LoginMobileProps {
    resetPassword?: boolean;
}

export const LoginMobile = ({ resetPassword }: LoginMobileProps) => {
    const i18n = useI18n((i18n) => ({ pagesTitles: i18n.pagesTitles }));

    return (
        <div className="login-mobile">
            <HelmetTitlePage title={i18n.pagesTitles.login} />

            <div className="language-btn">
                <LanguageBtnLogin />
            </div>

            <div className="main-content">
                <div className="logo-section">
                    <img className="logo" src={logo} alt="לוגו נקודה טובה" />
                </div>

                <div className="login-form-container">{resetPassword ? <ChangePassword /> : <Login />}</div>
            </div>

            <div className="accessibility-button">
                <AccessibilityIcon />
            </div>
        </div>
    );
};
