import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useI18n } from '../i18n/mainI18n';

import { useAlert } from '../common/contexts/AlertContext';

import Chat from '../components/Chat';
import { HelmetTitlePage } from '../components/HelmetTitlePage';
import { TextBox } from '../components/good-point-textbox/TextBox';
import TitledHeader from '../components/titled-header/TitledHeader';

import { isDesktop } from '../common/functions/isDesktop';
import { ChatHeaderDesktop } from './ChatHeaderDesktop';
import './sendGpChat.scss';

/**
 * Component for sending good points to teachers.
 * Displays the chat interface for sending messages and a text box for entering messages.
 * Supports both desktop and mobile views.
 */
export const SendGPToTeachers: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { firstName, lastName, id } = state;
    const i18n = useI18n((i18n) => ({ error: i18n.errors, message: i18n.general, pagesTitles: i18n.pagesTitles }));

    const alert = useAlert();

    useEffect(() => {
        if (!firstName || !lastName || !id) {
            navigate(-1);
            alert(i18n.error.somethingWentWrong, 'error');
        }
    }, [state]);

    const queryName = 'teacherGoodPoints';
    const path_get = '/api/teachers-good-points/get-gp';
    const path_post = '/api/teachers-good-points/save-gp';

    return (
        <div className="send-gp-chat titled-page">
            <HelmetTitlePage title={i18n.pagesTitles.sendGPToTeachers} />

            {isDesktop() ? (
                <ChatHeaderDesktop firstName={firstName} lastName={lastName} />
            ) : (
                <TitledHeader size="small" title={firstName + ' ' + lastName} onNavigate={() => navigate(-1)} />
            )}
            <Chat id={id} apiPath={path_get} queryName={queryName}></Chat>
            <TextBox id={id} queryName={queryName} apiPath={path_post} />
        </div>
    );
};
