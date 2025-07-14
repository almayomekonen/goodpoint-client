import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/mainI18n';
import { useAlert } from '../common/contexts/AlertContext';
import { isDesktop } from '../common/functions/isDesktop';
import { ChatHeaderDesktop } from './ChatHeaderDesktop';
import Chat from '../components/Chat';
import { TextBox } from '../components/good-point-textbox/TextBox';
import { OvalWithX } from '../components/OvalWithX';
import TitledHeader from '../components/titled-header/TitledHeader';
import { HelmetTitlePage } from '../components/HelmetTitlePage';

import './sendGpChat.scss';
import { useGroupMessage } from '../common/contexts/GroupMessageContext';

/**
 * Component for sending good points to a group of students.
 * Displays the chat interface for sending messages and a text box for entering messages.
 * Supports both desktop and mobile views.
 */
export const SendGroupGP: React.FC = () => {
    const navigate = useNavigate();
    const i18n = useI18n((i18n) => ({
        error: i18n.errors,
        general: i18n.general,
        chat: i18n.chatTexts,
        pagesTitles: i18n.pagesTitles,
    }));

    const alert = useAlert();
    const { groupMessageReceivers, setGroupMessageReceivers } = useGroupMessage();
    useEffect(() => {
        if (groupMessageReceivers?.length == 0) {
            navigate(-1);
            alert(i18n.error.somethingWentWrong, 'error');
        }
    }, []);

    const ids: number[] = [];
    groupMessageReceivers?.map((student) => ids.push(student.id));

    const queryName = 'groupGp';
    const path = '/api/good-points/save-group-gp';

    return (
        <div className="send-gp-chat titled-page">
            <HelmetTitlePage title={i18n.pagesTitles.sendGroupGP} />

            {isDesktop() ? (
                <ChatHeaderDesktop title={i18n.general.groupMessage} />
            ) : (
                <TitledHeader
                    size="small"
                    icon="back"
                    title={i18n.general.groupMessage}
                    onNavigate={() => navigate(-1)}
                />
            )}
            <div className="names">
                {groupMessageReceivers?.map((student, index) => (
                    <OvalWithX
                        key={student.id}
                        text={`${student.firstName} ${student.lastName}`}
                        onClick={() =>
                            ids.length > 2
                                ? setGroupMessageReceivers((prev) => {
                                      if (!prev) return prev;
                                      const copy = [...prev];
                                      copy?.splice(index, 1);
                                      return copy;
                                  })
                                : alert(i18n.chat.groupMessage, 'success')
                        }
                    />
                ))}
            </div>
            <Chat groupGp={true} queryName={queryName} id={ids}></Chat>
            <TextBox id={ids} groupGp={true} queryName={queryName} apiPath={path} />
        </div>
    );
};
