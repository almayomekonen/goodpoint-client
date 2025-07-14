import { Box, Button, Drawer, Snackbar, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatPhoneNumber } from '../../admin/common/functions/formatPhoneNumbers';
import { EmojiPaths } from '../../common/consts';
import { isDesktop } from '../../common/functions/isDesktop';
import { EmojiSender } from '../../common/types/emoji-sender.type';
import { Emoji } from '../../common/types/emoji.type';
import { TeacherActivityStudentGp } from '../../common/types/teacher-activity-good-point.type';
import { NewGpReactions } from '../../components/new-gp-reactions/NewGpReactions';
import { PoppingImages } from '../../components/popping-images/PoppingImages';
import { useI18n } from '../../i18n/mainI18n';
import './new-gp-notification.scss';
//pre importing the random positions for the popping images , to avoid lag
import '../../components/popping-images/popping-images.scss';

export type ReactionType = {
    sender: string | null;
    reaction: Emoji | null;
};

/**
 * Component: NewGpNotification
 * ---------------------------
 * This component represents the notification for a new good point received by a student. It displays the details of the good point,
 * allows the parent to select and send reactions, and provides options for continuing the conversation on WhatsApp. The component
 * supports different layouts for desktop and mobile devices.
 *
 * @returns {JSX.Element} The NewGpNotification component JSX element.
 */
export const NewGpNotification = () => {
    const [isReactionDrawerOpen, setIsReactionDrawerOpen] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<ReactionType>({ sender: null, reaction: null });
    const [isOtherSender, setIsOtherSender] = useState(false);
    const [otherSenderInput, setOtherSenderInput] = useState('');
    const [otherSender, setOtherSender] = useState<string | undefined>();
    const [lastSelectedEmoji, setLastSelectedEmoji] = useState<Emoji | undefined>();
    //animation controls for emojis and senders
    const emojisAnimationControls = useAnimationControls();

    const isInDesktop = isDesktop();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [isSendingReaction, setIsSendingReaction] = useState(false);
    const lastReaction = useRef<Emoji | undefined>();
    //error message in case the gp is too old to be displayed
    const [isGpTooOld, setIsGpTooOld] = useState(false);
    //reading the gp id through the url
    const { gpLinkHash } = useParams();

    //translations
    const i18n = useI18n((i) => {
        return {
            gpReceivedBy: i.general.gpReceivedBy,
            sendReaction: i.general.sendReaction,
            readAloud: i.general.readAloud,
            youReacted: i.general.youReacted,
            gpTooOld: i.general.gpIsTooOld,
            sendAReaction: i.reactionsTexts.sendAReaction,
            toSend: i.reactionsTexts.toSend,
            gpNotFound: i.general.gpNotFound,
            continueConvoOnWhatsapp: i.reactionsTexts.continueConvoOnWhatsapp,
            gpReactionWhatsappMessage: i.reactionsTexts.gpReactionWhatsappMessage,
            fromTeacher: i.general.fromTeacher,
        };
    });

    //fetching the gp using react query
    const { data: newGp, error: serverError } = useQuery(
        [gpLinkHash!],
        () =>
            axios<Partial<TeacherActivityStudentGp>>({
                params: {
                    link: gpLinkHash,
                },
                method: 'GET',
                url: '/api/good-points/get-gp-by-link',
            })
                .then((res) => res.data)
                .catch((err) => {
                    if (err?.status === 498) {
                        //meaning the gp is too old
                        setIsGpTooOld(true);
                    }
                }),
        {
            enabled: !!gpLinkHash,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        },
    );

    const { mutate: postReaction } = useMutation(
        async (
            data: {
                gpId: number | undefined;
            } & ReactionType,
        ) => axios.post('/api/good-points-reactions/send-reaction', data),
    );

    //when the selected reaction changes, we send it to the server, if the user selected a sender and a reaction, and is not in desktop
    useEffect(() => {
        if (isInDesktop) return;
        handleSendReactionClick();
    }, [selectedReaction]);

    useEffect(() => {
        //checking for a default sender in the local storage
        const defaultSender = localStorage.getItem('default_emoji_sender') as EmojiSender | null;
        if (defaultSender) {
            setSelectedReaction({ sender: defaultSender, reaction: null });
        }
    }, [newGp]);

    useEffect(() => {
        //get other option from local storage
        const otherOption = localStorage.getItem('other_sender');
        if (otherOption) {
            setOtherSender(otherOption);
        }
    }, []);

    function handleSendReactionClick(reaction: ReactionType = selectedReaction) {
        const isThereReaction = reaction.sender && reaction.reaction;

        if ((isOtherSender && otherSenderInput && isThereReaction) || (isThereReaction && !isOtherSender)) {
            sendReaction(reaction);
        } else {
            //activate a shake animation for the emojis
            if (!reaction.reaction)
                emojisAnimationControls.start({
                    rotate: [0, 10, -10, 10, -10, 10, -10, 0],
                    transition: {
                        duration: 0.5,
                        ease: 'easeInOut',
                        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
                    },
                });
        }
    }

    function sendReaction(reaction: ReactionType = selectedReaction) {
        //updated the latest reaction for the popping images
        lastReaction.current = reaction.reaction!;
        setLastSelectedEmoji(reaction.reaction!);
        // setting the isSendingReaction to true, so that the popping images will be displayed
        setIsSendingReaction(true);

        //adding the user's choice of sender to the local storage so that it will be the default sender next time
        //only add it if it wasn't the other sender
        if (!isOtherSender) {
            localStorage.setItem('default_emoji_sender', reaction.sender!);
            setSelectedReaction((prev) => {
                return { ...prev, reaction: null };
            });
        } else {
            //add the other option to the local storage
            localStorage.setItem('default_emoji_sender', otherSenderInput);
            localStorage.setItem('other_sender', otherSenderInput);
            setOtherSender(otherSenderInput);
            setSelectedReaction((prev) => {
                return { ...prev, sender: otherSenderInput, reaction: null };
            });
        }

        setTimeout(() => {
            setIsReactionDrawerOpen(false);
        }, 100);
        postReaction({ ...reaction, gpId: newGp?.id, sender: isOtherSender ? otherSenderInput : reaction.sender });
        setIsSnackbarOpen(true);
        // setSelectedReaction({ sender: null, reaction: null })
        setIsOtherSender(false);
        setOtherSenderInput('');

        //making time for the popping images animation , then closing it
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsSendingReaction(false);
        }, 2000);
    }

    /*handles the click on a sender*/
    function handleReactorClick(sender: string, isOtherSender: boolean = false) {
        //resetting the last emoji selected
        setLastSelectedEmoji(undefined);
        //if there was already a selected sender , reset the sender
        if (selectedReaction.sender) {
            setSelectedReaction((prev) => {
                return { ...prev, sender: null };
            });
            setIsOtherSender(false);
        } else {
            //if the sender is other, open the other sender drawer
            setSelectedReaction((prev) => {
                return { ...prev, sender };
            });
            if (isOtherSender) {
                setIsOtherSender(true);
                //reset the emoji
                setSelectedReaction((prev) => {
                    return { ...prev, reaction: null };
                });
                return;
            }
            //if not on mobile check if message should be sent
            if (!isInDesktop) handleSendReactionClick({ ...selectedReaction, sender });
        }
    }

    /*handles the click on a reaction*/
    function handleReactionClick(reaction: Emoji) {
        //if there was already a selected reaction , reset the reaction
        if (selectedReaction.reaction == reaction || lastSelectedEmoji == reaction) {
            setSelectedReaction((prev) => {
                return { ...prev, reaction: null };
            });
            setLastSelectedEmoji(undefined);
        } else {
            //reset last selected emoji
            setSelectedReaction((prev) => {
                return { ...prev, reaction };
            });
            setLastSelectedEmoji(undefined);
            //if not on mobile check if message should be sent
            if (!isInDesktop) handleSendReactionClick({ ...selectedReaction, reaction });
        }
    }

    function openWhatsappChat() {
        if (newGp?.teacher?.phoneNumber)
            window.open(
                `https://wa.me/${formatPhoneNumber(newGp.teacher.phoneNumber, true)}?text=${i18n.gpReactionWhatsappMessage}${newGp.student?.firstName}`,
                '_blank',
            );
    }

    //if the server returned error , display page not found
    if (serverError) {
        return (
            <div className="gp-not-found">
                <Typography className="gp-not-found-title">{i18n.gpNotFound}</Typography>
            </div>
        );
    }

    //checking if the gp has expired- meaning its not from this school year
    if (isGpTooOld)
        return (
            <div className="gp-too-old-message-container flex-center">
                <Typography className="gp-too-old-message">{i18n.gpTooOld}</Typography>
            </div>
        );
    else
        return (
            <div style={{ overflow: 'hidden', position: 'relative' }}>
                {lastReaction.current && (
                    <PoppingImages
                        isActive={isSendingReaction}
                        imgSrc={`/images/${EmojiPaths[lastReaction.current]}`}
                    />
                )}

                {/**side background natznazim */}
                {isInDesktop && (
                    <>
                        <Box
                            component={'img'}
                            className="left-new-gp-background"
                            src="/images/left-new-gp-background.svg"
                        />
                        <Box
                            component={'img'}
                            className="right-new-gp-background"
                            src="/images/left-new-gp-background.svg"
                        />
                    </>
                )}
                <>
                    {newGp && (
                        <div className="new-gp-notification-container custom-scroll-bar">
                            {/**image */}
                            <Box
                                alt="open-letter"
                                component="img"
                                src="/images/new-gp-notification.svg"
                                className="new-gp-notification-image"
                            />

                            <div className="new-gp-content-container">
                                <Typography className="new-gp-notification-title">
                                    {`${i18n.gpReceivedBy}${newGp?.student?.firstName} ${i18n.fromTeacher} ${newGp?.teacher?.firstName} ${newGp.teacher?.lastName}`}
                                </Typography>

                                <Typography className="new-gp-notification-content">{newGp?.gpText}</Typography>

                                {/**button to activate text to speech  */}
                                {/**TODO:make tts work */}
                                {/* <button className='new-gp-content-read-aloud-button clean-no-style-button'>
                                    {i18n.readAloud}
                                </button> */}
                            </div>

                            {/*drawer for reacting in mobile, or reactions box in desktop */}
                            {isInDesktop ? (
                                <Box
                                    className="desktop-reactions-box"
                                    style={{
                                        width: 30 + Math.max(0, (otherSender ?? '').length * 2 - 5) + 'rem',
                                        height: isOtherSender
                                            ? newGp.teacher?.phoneNumber
                                                ? '29rem'
                                                : '25.5rem'
                                            : newGp.teacher?.phoneNumber
                                              ? '24rem'
                                              : '20rem',
                                    }}
                                >
                                    <Typography className="desktop-reactions-box-header">
                                        {i18n.sendReaction}
                                    </Typography>
                                    <Typography className="desktop-reactions-box-description">
                                        {i18n.sendAReaction}
                                    </Typography>
                                    <NewGpReactions
                                        handleReactionClick={handleReactionClick}
                                        handleReactorClick={handleReactorClick}
                                        otherSender={otherSender}
                                        emojisAnimationControls={emojisAnimationControls}
                                        otherSenderInput={otherSenderInput}
                                        setOtherSenderInput={setOtherSenderInput}
                                        isOtherSender={isOtherSender}
                                        setIsOtherSender={setIsOtherSender}
                                        studentFirstName={newGp?.student?.firstName}
                                        selectedReaction={selectedReaction}
                                        setSelectedReaction={setSelectedReaction}
                                        lastSelectedEmoji={lastSelectedEmoji}
                                    />
                                    <Button
                                        onClick={() => handleSendReactionClick()}
                                        className="desktop-send-reaction clean-no-style-button"
                                    >
                                        {i18n.toSend}
                                    </Button>

                                    {/**continue convo on whatsapp button */}
                                    {newGp.teacher?.phoneNumber && (
                                        <button
                                            onClick={openWhatsappChat}
                                            className="continue-on-whatsapp-button desktop-whatsapp-button "
                                        >
                                            <Typography className="continue-on-whatsapp-text">
                                                {i18n.continueConvoOnWhatsapp}
                                            </Typography>
                                            <img className="whatsapp-icon" src="/images/whatsapp-logo.svg" />
                                        </button>
                                    )}
                                </Box>
                            ) : (
                                <Drawer
                                    className={clsx(
                                        'new-gp-reaction-drawer-container',
                                        isOtherSender && 'other-sender-drawer',
                                        !newGp.teacher?.phoneNumber && 'reactions-with-whatsapp',
                                    )}
                                    anchor="bottom"
                                    open={isReactionDrawerOpen}
                                    onClose={() => {
                                        setIsReactionDrawerOpen(false);
                                    }}
                                    ModalProps={{
                                        keepMounted: true,
                                    }}
                                >
                                    <div
                                        onClick={() => setIsReactionDrawerOpen((prev) => !prev)}
                                        className="drawer-puller flex-center"
                                    >
                                        <Box
                                            //flipping the arrow if the drawer is open
                                            sx={{
                                                transform: isReactionDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            }}
                                            component="img"
                                            src={`/images/arrow-up.svg`}
                                            className="open-reaction-button"
                                        />
                                        <Typography className="send-reaction-puller-text">
                                            {i18n.sendReaction}
                                        </Typography>
                                    </div>

                                    {/**putting fade fixes a visual bug where some of the content will stick out for a sec
                                     * when the drawer is closing
                                     */}
                                    <AnimatePresence>
                                        {isReactionDrawerOpen && (
                                            <motion.div
                                                exit={{
                                                    opacity: 0,
                                                    transition: {
                                                        duration: 0.2,
                                                    },
                                                }}
                                                className="new-gp-reaction-drawer-content"
                                            >
                                                <>
                                                    <NewGpReactions
                                                        handleReactionClick={handleReactionClick}
                                                        handleReactorClick={handleReactorClick}
                                                        otherSender={otherSender}
                                                        otherSenderInput={otherSenderInput}
                                                        setOtherSenderInput={setOtherSenderInput}
                                                        isOtherSender={isOtherSender}
                                                        setIsOtherSender={setIsOtherSender}
                                                        studentFirstName={newGp?.student?.firstName}
                                                        selectedReaction={selectedReaction}
                                                        setSelectedReaction={setSelectedReaction}
                                                        lastSelectedEmoji={lastSelectedEmoji}
                                                    />
                                                    {/**continue convo on whatsapp button */}
                                                    {newGp.teacher?.phoneNumber && (
                                                        <button
                                                            style={{
                                                                transform: `translateY(${selectedReaction.sender && !isOtherSender ? '0rem' : isOtherSender ? '4rem' : otherSender ? '4rem' : '1rem'})`,
                                                            }}
                                                            onClick={openWhatsappChat}
                                                            className="continue-on-whatsapp-button desktop-whatsapp-button"
                                                        >
                                                            <Typography className="continue-on-whatsapp-text">
                                                                {i18n.continueConvoOnWhatsapp}
                                                            </Typography>
                                                            <img
                                                                className="whatsapp-icon"
                                                                src="/images/whatsapp-logo.svg"
                                                            />
                                                        </button>
                                                    )}
                                                </>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Drawer>
                            )}

                            {/**snackbar to alert user that he sent a reaction to the gp */}
                            <Snackbar
                                onClick={() => setIsSnackbarOpen(false)}
                                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                                open={isSnackbarOpen}
                                onClose={() => setIsSnackbarOpen(false)}
                                autoHideDuration={700}
                            >
                                <Box className="successful-reaction-message flex-center">
                                    <Typography className="successful-reaction-snack-bar">
                                        {'!' + i18n.youReacted}
                                    </Typography>
                                </Box>
                            </Snackbar>
                        </div>
                    )}
                </>
            </div>
        );
};
