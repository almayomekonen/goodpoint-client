import { FC } from 'react';
import { UserCard } from '../components/user-card/UserCard';
import './chatHeaderDesktop.scss';
import { SchoolGrades } from '../common/enums';

interface ChatHeaderDesktopProps {
    firstName?: string;
    lastName?: string;
    gpCount?: number;
    title?: string;
    class?: { grade: SchoolGrades };
}

/**
 * In desktop chat there are 3 cases of headers:
 *
 * In a student's chat, his name and the number of his good points will appear,
 *
 * In a teacher's chat, only the name will appear,
 *
 * In group chat a title will appear.
 */
export const ChatHeaderDesktop: FC<ChatHeaderDesktopProps> = ({
    firstName,
    lastName,
    gpCount,
    title,
    class: classroom,
}) => {
    return (
        <div className="header-chat-desktop">
            {firstName && lastName ? (
                gpCount ? (
                    <UserCard
                        cardType="user-gpCount"
                        isHeader
                        firstName={firstName}
                        lastName={lastName}
                        gpCount={gpCount}
                        grade={classroom?.grade}
                    />
                ) : (
                    <UserCard
                        cardType="user-name"
                        isHeader
                        firstName={firstName}
                        lastName={lastName}
                        grade={classroom?.grade}
                    />
                )
            ) : (
                <span className="title-header">{title}</span>
            )}
        </div>
    );
};
