import { FC, useRef, useState } from 'react';

import { Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { clsx } from 'clsx';
import { EmojiPaths } from '../../common/consts';
import { isDesktop } from '../../common/functions/isDesktop';
import { useOutsideClick } from '../../common/hooks/use-outside-click';
import { Emoji } from '../../common/types/emoji.type';

interface Props {
    isHovering: boolean;
    gpId: number;
    currentEmoji?: Emoji;
}

export const ReactToGp: FC<Props> = ({ isHovering, gpId, currentEmoji }) => {
    const [areEmojisOpen, setAreEmojisOpen] = useState(false);
    const isInDesktop = isDesktop();
    const queryClient = useQueryClient();
    const containerRef = useRef<HTMLDivElement>(null);

    //detecting outside click to close bar
    useOutsideClick(containerRef, () => {
        setAreEmojisOpen(false);
    });
    //uploading a reaction
    const { mutate: addReaction } = useMutation(
        (emoji: Emoji) => axios.post('/api/teachers-good-points/add-reaction', { reaction: emoji, gpId }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacher-received-gps']);
            },
        },
    );

    function handleReactionClick(emoji: Emoji) {
        addReaction(emoji);
        //close the emoji menu
        setAreEmojisOpen(false);
    }

    function handleEmojiMenuClick() {
        setAreEmojisOpen((prev) => !prev);
    }

    return (
        <div ref={containerRef} className="react-to-gp-container">
            <div
                className="user-card-react-to-gp-container"
                style={{
                    transform: `scale(${areEmojisOpen ? 1 : 0})`,
                }}
            >
                {Object.keys(EmojiPaths).map((emoji, index) => {
                    return (
                        <button
                            onClick={() => handleReactionClick(emoji as Emoji)}
                            key={index}
                            className={clsx(
                                'clean-no-style-button react-to-gp-button',
                                currentEmoji === emoji && 'active-emoji',
                            )}
                        >
                            <img
                                className="react-to-gp-emoji"
                                src={`/images/${EmojiPaths[emoji as Emoji]}`}
                                alt="emoji"
                            />
                        </button>
                    );
                })}
            </div>

            {(isHovering || areEmojisOpen || !isInDesktop) && (
                <Box
                    //allows clicking on the emoji to close the menu on mobile
                    zIndex={isInDesktop ? 0 : 1}
                    onClick={handleEmojiMenuClick}
                    className="add-reaction-emoji-container"
                >
                    <img className="add-reaction-emoji" src={`/images/react-to-gp.svg`} alt="emoji" />
                </Box>
            )}
        </div>
    );
};
