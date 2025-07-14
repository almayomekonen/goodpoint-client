import Button from '@mui/material/Button';
import { FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { pagesImgSrc } from '../../common/consts/pagesImagesSrc.const';
import { AddToSpamEnum } from '../../common/enums';
import { useI18n } from '../../i18n/mainI18n';

import './UnsubscribeSuccess.scss';

/**
 * Component for displaying a success message after unsubscribing from email or sms notifications.
 */
export const UnsubscribeSuccess: FC = () => {
    const { type } = useParams();

    const i18n = useI18n((i18n) => ({ unsubscribeTexts: i18n.unsubscribeTexts, goodPoint: i18n.navbar.goodPoint }));

    if (!type || !Object.values(AddToSpamEnum).find((knownType) => knownType === type)) {
        return <Navigate replace to={'/'} />;
    }

    return (
        <div className="UnsubscribeSuccess">
            <p>
                {i18n.unsubscribeTexts.hey}{' '}
                {type === AddToSpamEnum.EMAIL ? i18n.unsubscribeTexts.email : i18n.unsubscribeTexts.sms}
                <br />
                {i18n.unsubscribeTexts.ifYouRegret}
                {'❤️'}
            </p>
            <br />
            <br />
            <br />
            <p>{i18n.unsubscribeTexts.thanks}</p>
            <img className="app-logo" alt={i18n.goodPoint} src="/images/logo/logo-with-text.svg" />

            <br />
            <img className="placeholder-image" src={pagesImgSrc.firstLogin} alt="" />

            <Button href="/" variant="contained" className="navigate-home">
                {i18n.unsubscribeTexts.backHome}
            </Button>
        </div>
    );
};
