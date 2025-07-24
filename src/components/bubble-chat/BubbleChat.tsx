import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Snackbar } from '@mui/material';
import clsx from 'clsx';
import { formatDateTime } from '../../common/functions/format-date-time';
import { useOnLongPress } from '../../common/hooks/useOnLongPress';
import { GoodPointInformation } from '../../common/types';
import { useI18n } from '../../i18n/mainI18n';
import './BubbleChat.scss';
import { FC } from 'react';

interface ChatProps {
    goodPoint: GoodPointInformation;
    containerRef: React.RefObject<HTMLDivElement>;
}

const BubbleChat: FC<ChatProps> = ({
    goodPoint: { date, firstName, lastName, gpText, viewCount, isMe },
    containerRef,
}) => {
    const gpCopied = useI18n((i) => i.general.gpCopied);

    //hook for capturing long press on gpText , then copying it to clipboard
    const { didLongPress: didCopy, onTouchEnd, onTouchStart } = useOnLongPress(onLongPress, containerRef);

    async function onLongPress() {
        navigator.clipboard.writeText(gpText);
    }
    isMe = Number(isMe);

    return (
        <>
            <Snackbar
                sx={{ transform: 'translateY(-180%)' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                open={didCopy}
                autoHideDuration={2000}
            >
                <div className="copied-to-clipboard-alert">{gpCopied}</div>
            </Snackbar>
            <div className={clsx('bubble-chat', isMe && 'right')}>
                {!isMe && firstName && (
                    <p spellCheck={false} className="teacher-name">
                        {firstName + ' ' + lastName}
                    </p>
                )}
                <div
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    className={clsx('bubble', isMe ? 'from-me' : 'from-other')}
                >
                    <p spellCheck={false} className="goodpoint">
                        {gpText}
                    </p>
                </div>

                <div className="viewed">
                    {!!isMe ? (
                        viewCount > 0 ? (
                            <DoneAllIcon sx={{ color: '#63B1C7' }} fontSize="medium" />
                        ) : (
                            <DoneAllIcon fontSize="medium" color="disabled" />
                        )
                    ) : null}
                    <div className="date">{formatDateTime(new Date(date), 'hours')}</div>
                </div>
            </div>
        </>
    );
};
export default BubbleChat;
