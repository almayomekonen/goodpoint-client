import React from 'react';
import { EmojiPaths } from '../../common/consts';
import { useReactionModal } from '../../common/contexts/ReactionModalContext';
import { EmojiSender } from '../../common/types/emoji-sender.type';
import { Emoji } from '../../common/types/emoji.type';
import { UserCard } from '../user-card/UserCard';
import { Box, Typography } from '@mui/material';
import { countEmojis } from '../../common/functions/countEmojis';
import { useI18n } from '../../i18n/mainI18n';
import clsx from 'clsx';

interface props {
    isMobile?: boolean;
}
/**
 *
 * @param isMobile determines whether this is a mobile component
 * @returns returns an organized list of reactions to a certain gp , using the reactionModal context
 */
export const Reactions: React.FC<props> = ({ isMobile }) => {
    const { reactions, receiverName } = useReactionModal();
    const emojisCounter = countEmojis(reactions.map((r) => r.reaction));
    const i18n = useI18n((i) => {
        return {
            reactionsTexts: i.reactionsTexts,
            generalTexts: i.general,
        };
    });

    return (
        <Box
            width={'100%'}
            height={'100%'}
            className={clsx('emojis-modal', !isMobile && 'desktop-emojis-modal-container')}
        >
            {isMobile && <div className="modal-dragger" />}

            {/* the basic details about how many reactions were made, which emojis were sent  */}
            <div className="emojis-modal-emojis-sum-up">
                {/*total amount of reactions made */}
                <Typography marginRight={'0.5rem'} fontSize="1.3em">
                    {i18n.generalTexts.everything}: {emojisCounter.totalCount}
                </Typography>

                {/*all the different/unique emoji reactions sent */}
                {Object.keys(emojisCounter.emojisCount).map((emoji, index) => {
                    return (
                        <Box key={index} className="emojis-count">
                            <Box
                                className="emoji-count-icon"
                                component="img"
                                src={`/images/${EmojiPaths[emoji as Emoji]}`}
                            />
                            <Typography fontSize="1.3em">{emojisCounter.emojisCount[emoji as Emoji]}</Typography>
                        </Box>
                    );
                })}

                <Box />
            </div>

            {/*displaying the actual reaction- who made it and what emoji was used */}
            <Box className="emojis-modal-text">
                {reactions.map((reaction) => {
                    let name = '';
                    if (reaction.sender == EmojiSender.STUDENT) name = receiverName;
                    else if (Object.values(EmojiSender).includes(reaction.sender as EmojiSender))
                        name = i18n.reactionsTexts[EmojiSender[reaction.sender as EmojiSender]];
                    else name = reaction.sender;
                    return (
                        <UserCard
                            className="emojis-modal-user-card"
                            key={reaction.id}
                            cardType="user-name"
                            firstName={name}
                            lastName={
                                Object.values(EmojiSender).includes(reaction.sender as EmojiSender) &&
                                reaction.sender != EmojiSender.STUDENT
                                    ? receiverName
                                    : ''
                            }
                            reaction={reaction.reaction}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};
