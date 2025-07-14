import { Box, Fade, TextField } from '@mui/material';
import clsx from 'clsx';
import { AnimationControls, motion } from 'framer-motion';
import { LeftArrowIcon } from '../../../public/images/LeftArrowIcon';
import { RightArrowIcon } from '../../../public/images/RightArrowIcon';
import { EmojiPaths } from '../../common/consts';
import { isDesktop } from '../../common/functions/isDesktop';
import { EmojiSender } from '../../common/types/emoji-sender.type';
import { Emoji } from '../../common/types/emoji.type';
import { useI18n } from '../../i18n/mainI18n';
import { ReactionType } from '../../pages/new-gp-notification/NewGpNotification';

import React, { FC, useRef } from 'react';

import './new-gp-reactions.scss';

interface Props {
    selectedReaction: ReactionType;
    studentFirstName: string | undefined;
    isOtherSender: boolean;
    setIsOtherSender: React.Dispatch<React.SetStateAction<boolean>>;
    otherSenderInput: string;
    setOtherSenderInput: React.Dispatch<React.SetStateAction<string>>;
    emojisAnimationControls?: AnimationControls;
    otherSender?: string;
    handleReactionClick: (reaction: Emoji) => void;
    handleReactorClick: (sender: string, isOtherSender: boolean) => void;
    setSelectedReaction: React.Dispatch<React.SetStateAction<ReactionType>>;
    lastSelectedEmoji?: Emoji;
}

export const NewGpReactions: FC<Props> = ({
    selectedReaction,
    emojisAnimationControls,
    studentFirstName,
    isOtherSender,
    setIsOtherSender,
    setOtherSenderInput,
    otherSenderInput,
    otherSender,
    handleReactionClick,
    handleReactorClick,
    setSelectedReaction,
    lastSelectedEmoji,
}) => {
    const i18n = useI18n((i) => {
        return {
            family: i.general.family,
            whatsYourName: i.general.whatsYourName,
        };
    });
    const isInDesktop = isDesktop();
    const otherInputRef = useRef<HTMLInputElement>(null);

    const emojiReactions = Object.keys(EmojiPaths) as Emoji[];

    //all the possible senders of emoji reactions to the gp
    const emojisSenders = Object.values(EmojiSender);
    //all the possible emoji reactions to the gp

    /*resets the reactor*/
    function resetReactor() {
        setIsOtherSender(false);
        setSelectedReaction((prev) => {
            return { ...prev, sender: null };
        });
    }

    function handleEmojiClick(emoji: Emoji) {
        //if no other sender was selected , focus on the other sender input
        if (isOtherSender && !otherSenderInput) {
            otherInputRef.current?.focus();
            return;
        }

        handleReactionClick(emoji);
    }

    return (
        <>
            <div
                style={{
                    height: isOtherSender ? (isInDesktop ? '7rem' : '2rem') : '2rem',
                }}
                className="reactors-container"
            >
                {/**the reaction sender select options */}
                <div className="emoji-reactors">
                    {(otherSender ? [...emojisSenders, otherSender] : [...emojisSenders]).map((sender, index) => {
                        const isOtherSender = !Object.values(EmojiSender).includes(sender as EmojiSender);
                        return (
                            <div
                                key={index}
                                style={{
                                    //if a sender is selected, the sender buttons are moved to the center
                                    left: selectedReaction.sender
                                        ? isInDesktop
                                            ? '41%'
                                            : '43%'
                                        : !isInDesktop && isOtherSender
                                          ? '43%'
                                          : (isInDesktop
                                                ? (otherSender ? 3.5 - Math.max(0, otherSender.length - 5) / 2 : 6) +
                                                  index * 5.9
                                                : 6 + index * 5.9) +
                                            (isOtherSender ? Math.max(0, sender.length - 5) / 2 : 0) +
                                            'rem',
                                    //the selected sender is put on top of the others
                                    zIndex: selectedReaction.sender == sender ? 1 : -1,
                                    //make slightly bigger the selected sender
                                    bottom:
                                        (isInDesktop ? -1 : selectedReaction.sender ? -1 : isOtherSender ? -4.3 : -1) +
                                        'rem',
                                }}
                                className={clsx(
                                    'reaction-selector-button',
                                    selectedReaction.sender &&
                                        selectedReaction.sender != sender &&
                                        sender.length > 5 &&
                                        'not-current-sender',
                                )}
                            >
                                {/*left arrow button to show all the sender*/}
                                {selectedReaction.sender == sender && (
                                    <button
                                        className="clean-no-style-button left-show-reactors-button"
                                        onClick={resetReactor}
                                    >
                                        <LeftArrowIcon className="selected-sender-show-more-icon" />
                                    </button>
                                )}

                                <button
                                    onClick={() => handleReactorClick(sender, sender == EmojiSender.OTHER)}
                                    key={index}
                                    className={clsx(
                                        'emoji-sender',
                                        'flex-center',
                                        'clean-no-style-button',
                                        sender === selectedReaction.sender && 'selected-reactor',
                                    )}
                                    style={{
                                        width: !isOtherSender ? '5.3rem' : Math.max(5.3, sender.length) + 'rem',
                                    }}
                                >
                                    {sender != EmojiSender.STUDENT
                                        ? !isOtherSender
                                            ? i18n.family[sender as keyof typeof i18n.family]
                                            : sender
                                        : /**showing the student name as the sender */
                                          studentFirstName}
                                </button>

                                {/*right arrow button to show all the sender*/}
                                {selectedReaction.sender == sender && (
                                    <button
                                        className="clean-no-style-button right-show-reactors-button"
                                        onClick={resetReactor}
                                    >
                                        <RightArrowIcon className="selected-sender-show-more-icon" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/**other sender input  */}
                <Fade
                    unmountOnExit
                    timeout={{
                        enter: 900,
                        exit: 300,
                    }}
                    in={isOtherSender}
                    className="other-sender-input-container"
                >
                    <TextField
                        className="other-sender-input"
                        value={otherSenderInput}
                        onChange={(e) => setOtherSenderInput(e.target.value)}
                        placeholder={i18n.whatsYourName}
                        variant="outlined"
                        size="small"
                        autoFocus={isInDesktop}
                        inputRef={otherInputRef}
                    />
                </Fade>
            </div>

            {/**the reaction select options */}
            <div
                className="emojis-reactions-icons"
                style={
                    isInDesktop
                        ? {}
                        : {
                              marginBottom: selectedReaction.sender && !isOtherSender ? '1rem' : '0rem',
                              transform: `translateY(${selectedReaction.sender && !isOtherSender ? '1rem' : isOtherSender ? '4rem' : otherSender ? '4rem' : '1rem'})`,
                          }
                }
            >
                {emojiReactions.map((reaction, index) => {
                    return (
                        <motion.div
                            animate={emojisAnimationControls}
                            key={index}
                            style={{
                                left: (isInDesktop ? 1 + index * 5.5 : 2.7 + index * 5) + 'rem',
                                //transition is zero seconds when the user has not clicked on any sender yet, to not trigger an animation on load
                                zIndex: selectedReaction.reaction == reaction ? 1 : 0,
                            }}
                            className="flex-center reaction-selector-button reaction-emoji-button"
                        >
                            <button
                                onClick={() => handleEmojiClick(reaction)}
                                key={index}
                                className={clsx(
                                    (selectedReaction.reaction === reaction || lastSelectedEmoji == reaction) &&
                                        'selected-emoji',
                                    'emojis-reaction-icon-container',
                                    'clean-no-style-button',
                                    'flex-center',
                                )}
                            >
                                <Box
                                    sx={{
                                        transform:
                                            selectedReaction.reaction === reaction || lastSelectedEmoji == reaction
                                                ? `scale(${isInDesktop ? '1.25' : '1.3'})`
                                                : 'scale(1)',
                                    }}
                                    className="emojis-reaction-icon"
                                    component="img"
                                    src={`/images/${EmojiPaths[reaction]}`}
                                />
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
};
