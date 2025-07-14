import { FC, MouseEventHandler, SyntheticEvent } from 'react';

import { Box, Typography } from '@mui/material';
import { EmojiPaths } from '../../common/consts';
import { useReactionModal } from '../../common/contexts/ReactionModalContext';
import { countEmojis } from '../../common/functions/countEmojis';
import { Emoji } from '../../common/types/emoji.type';
import { Reaction } from '../../common/types/reaction.type';

import './emojis-bar.scss';

interface EmojisProps {
    reactions: Reaction[];
    maxNumberOfEmojis: number;
    receiver: {
        firstName: string;
        lastName: string;
    };
}

export const EmojisBar: FC<EmojisProps> = (props) => {
    if (!props.reactions.length) return null;

    const { setIsOpen, setReactions, setReceiverName, setPos } = useReactionModal();

    const emojisCounter = countEmojis(props.reactions.map((r) => r.reaction));
    const uniqueEmojis = Object.keys(emojisCounter.emojisCount);

    function handleClick(e: SyntheticEvent) {
        e.stopPropagation();
        setIsOpen(true);
        setReactions(props.reactions);
        setReceiverName(props.receiver.firstName);

        const { top, left } = e.currentTarget.getBoundingClientRect();

        setPos({ x: left, y: top });
    }
    return (
        <button onClick={handleClick as unknown as MouseEventHandler<HTMLButtonElement>} className="emojis-container">
            {props.reactions.length > props.maxNumberOfEmojis && (
                <Typography className="emoji-count">
                    {props.reactions.length - Math.min(uniqueEmojis.length, props.maxNumberOfEmojis)}+
                </Typography>
            )}
            <div className="emojis-bar-emojis-container flex-center">
                {uniqueEmojis.slice(0, props.maxNumberOfEmojis).map((reaction, index) => {
                    return (
                        <Box
                            key={index}
                            className="emoji-icon"
                            component="img"
                            src={`/images/${EmojiPaths[reaction as Emoji]}`}
                        />
                    );
                })}
            </div>
        </button>
    );
};
