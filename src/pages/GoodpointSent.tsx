import { useEffect } from 'react';

import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import animationData from '../assets/confetti.json';
import { useI18n } from '../i18n/mainI18n';
import image from '/images/pages-images/teacher-activity-background.svg';

import './goodpointSent.scss';

export const GoodpointSent = () => {
    const i18n = useI18n((i18n) => i18n.general);
    const navigate = useNavigate();
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate(-1);
        }, 3000);
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="gp-sent fade-in">
            <Lottie className="confetti" animationData={animationData} loop={false} />
            <img className="gp-sent-img" src={image} alt="" />
            <div className="gp-sent-text">{i18n.gpSent}</div>
        </div>
    );
};
