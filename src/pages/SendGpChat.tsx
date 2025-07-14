import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useI18n } from '../i18n/mainI18n';

import { useAlert } from '../common/contexts/AlertContext';
import { isDesktop } from '../common/functions/isDesktop';

import BackArrowIcon from '@mui/icons-material/EastRounded';
import Favorite from '@mui/icons-material/Favorite';
import Chat from '../components/Chat';
import { HelmetTitlePage } from '../components/HelmetTitlePage';
import { TextBoxWithPM } from '../components/good-point-textbox/TextBoxWithPM';
import TitledHeader from '../components/titled-header/TitledHeader';
import { ChatHeaderDesktop } from './ChatHeaderDesktop';

import './sendGpChat.scss';

/**
 * Component for sending good points to a specific student.
 * Displays the chat interface for sending messages and a text box for entering messages.
 * Supports both desktop and mobile views.
 */
export const SendGP: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { firstName, lastName, gpCount: _gpCount, id, gender } = state;
    const i18n = useI18n((i18n) => ({
        error: i18n.errors,
        message: i18n.general,
        general: i18n.general,
        pagesTitles: i18n.pagesTitles,
    }));

    const alert = useAlert();

    useEffect(() => {
        if (!firstName || !id || !gender) {
            navigate(-1);
            alert(i18n.error.somethingWentWrong, 'error');
        }
    }, [state]);

    const [gpCount, setGpCount] = useState(_gpCount);

    useEffect(() => {
        if (!isDesktop()) {
            if (_gpCount !== gpCount) {
                navigate('/send-gp-chat', { state: { ...state, gpCount: Math.max(_gpCount, gpCount) }, replace: true });
            }
            setGpCount(Math.max(_gpCount, gpCount));
        }
    }, [_gpCount]);

    const [presetMessages, setPresetMessages] = useState(false);
    const [, setNotBottom] = useState(false);

    //For the "presetMessages" know that the page will be revealed to the bottom.
    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const notBottom = Math.abs(0 - e.currentTarget.scrollTop) > e.currentTarget.clientHeight / 100;

        if (notBottom) {
            setNotBottom(true);
        } else {
            setNotBottom(false);
        }
    };

    const backPress = useRef(true);

    useEffect(() => {
        //For when you press back, the presetMessage keyboard closes-
        //we change the route to stay in this page.

        if (!isDesktop()) {
            if (presetMessages && backPress.current) {
                navigate('/send-gp-chat', { state });
                backPress.current = false;
            } else if (!presetMessages && !backPress.current) {
                navigate(-1);
            }
        }
    }, [presetMessages]);

    function onPopState() {
        if (!backPress.current) {
            setPresetMessages(false);
            backPress.current = true;
        }
        //  if presetMessage keyboard was open, we have history.
        //  if the presetMessage keyboard close now, the prev buttun need to go to prev page.
        else if (document.location.pathname === '/send-gp-chat') {
            navigate(-1);
        }
    }

    useEffect(() => {
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    //If the chat is scrolled down, when the PM keyboard opens the chat should be scrolled down and the keyboard should not go above it.

    const path = '/api/good-points/get-gp';
    const queryName = 'goodPoints';

    return (
        <div className="send-gp-chat titled-page">
            <HelmetTitlePage title={i18n.pagesTitles.sendGP} />

            {isDesktop() ? (
                <ChatHeaderDesktop firstName={firstName} lastName={lastName} gpCount={_gpCount} class={state.class} />
            ) : (
                <TitledHeader size="small">
                    <div className="header-container">
                        <BackArrowIcon className="prev-icon" onClick={() => navigate(-1)} />
                        <div className="student-description">
                            <p className="student-name">
                                {' '}
                                {firstName} {lastName}
                            </p>
                            <div className="user-gp-count">
                                <Favorite className="heart-icon" />
                                {gpCount} {i18n.general.goodPoints}
                            </div>
                        </div>
                        <div className="space"></div>
                    </div>
                </TitledHeader>
            )}

            <Chat
                presetMessages={presetMessages}
                id={id}
                handleScroll={handleScroll}
                apiPath={path}
                queryName={queryName}
            ></Chat>
            <TextBoxWithPM
                id={id}
                name={firstName}
                gender={gender}
                presetMessages={presetMessages}
                setPresetMessages={setPresetMessages}
            />
        </div>
    );
};
