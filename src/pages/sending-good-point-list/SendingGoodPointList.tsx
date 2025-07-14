import React, { useRef, useState } from 'react';

import { Box, TextField, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGroupMessage } from '../../common/contexts/GroupMessageContext';
import { useSendGpModal } from '../../common/contexts/SendGpModalContext';
import { useQueryName } from '../../common/contexts/StudentListQueryContext';
import { isDesktop } from '../../common/functions/isDesktop';
import { useScrollDirection } from '../../common/hooks/use-scroll-direction';
import { GroupMessageReceiver } from '../../common/types/group-message-receiver.type';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
import { GoodPointReceiverList } from '../../components/good-point-receiver-list/GoodPointReceiverList';
import { Scrollable } from '../../components/scrollable/Scrollable';
import { UsersNav } from '../../components/users-nav/UsersNav';
import { useI18n } from '../../i18n/mainI18n';

import './sending-good-point-list.scss';

/**
 * Component for selecting users and sending good points.
 *
 * This component renders a user interface that allows the selection of users to whom a good point can be sent.
 * It provides a search bar for filtering users by name and supports both single and group messaging.
 * Users can be selected individually or as a group for sending the good point.
 *
 * @returns JSX.Element
 */
export const SendingGoodPointList: React.FC = () => {
    const [filterName, setFilterName] = useState('');
    const { isGroupSending, setIsGroupSending } = useGroupMessage();
    const [isTyping, setIsTyping] = useState(false);
    const { setIsModalOpen } = useSendGpModal();
    const theme = useTheme();

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInDesktop = isDesktop();
    const i18n = useI18n((i) => {
        return {
            generalTexts: i.general,
            sendingGpListTexts: i.sendingGoodPointList,
            pagesTitles: i.pagesTitles,
        };
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollDirection] = useScrollDirection(containerRef);
    const { setStudentsQueryName } = useQueryName();

    const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsTyping(true);
        setFilterName(e.target.value);

        if (timeoutRef.current) clearTimeout(timeoutRef.current); //clearing the current running timeout
        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            setIsTyping(false);
        }, 500);
    };

    const { groupMessageReceivers, setGroupMessageReceivers } = useGroupMessage();
    const navigate = useNavigate();

    function removeReceiver(id: string | number) {
        setGroupMessageReceivers((prev) => {
            if (!prev) return prev;
            return prev?.filter((user) => user.id !== id);
        });
    }
    function addReceiver(newUser: GroupMessageReceiver) {
        setGroupMessageReceivers((prev) => {
            if (!prev) return [{ ...newUser }];
            else {
                return [...prev, { ...newUser }];
            }
        });
    }

    function handleGroupMessageReceiverSelect(newUser: GroupMessageReceiver) {
        const doesUserExist = groupMessageReceivers?.some((user) => user.id === newUser.id);
        if (doesUserExist)
            //meaning the checkbox was checked already
            removeReceiver(newUser.id);
        else addReceiver(newUser);
    }

    function handleGroupMessage() {
        //send a gp to every user in the groupMessageReceivers list
        if (!groupMessageReceivers || groupMessageReceivers.length === 0) return;

        //closing desktop sendgp modal
        if (isInDesktop) {
            setIsModalOpen(false);
            setIsGroupSending(false);
        }
        if (groupMessageReceivers.length > 1)
            //send to group gp route
            navigate('/send-gp-chat-group');
        //send to single gp route with proper state
        else {
            const user = groupMessageReceivers[0];
            if (user.class) {
                setStudentsQueryName(['students', user.class.grade, user.class.classIndex].join('-'));
            }
            navigate(`/send-gp-chat`, {
                state: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    id: user.id,
                    gender: user.gender,
                    gpCount: user.gpCount,
                },
            });
        }
    }

    return (
        <>
            <Box className="sending-good-point-list-container">
                {/*metadata */}
                <HelmetTitlePage title={i18n.pagesTitles.sendingGoodPointList} />

                {/*header of page  */}
                <Box width={'100%'} className="sending-good-point-list-header">
                    <Typography sx={{ direction: 'rtl' }} className="sending-good-point-list-users-container-header">
                        {isGroupSending
                            ? i18n.sendingGpListTexts.chooseGroupMessageReceivers
                            : '? ' + i18n.sendingGpListTexts.forWho}
                    </Typography>
                </Box>

                {/**button on the bottom left to toggle group messaging */}
                {isGroupSending ? (
                    <button
                        style={{
                            bottom: '2%',
                            position: isInDesktop ? 'absolute' : 'fixed',
                        }}
                        onClick={handleGroupMessage}
                        className="send-group-gp-button"
                    >
                        <Typography className="send-group-gp-text">{i18n.generalTexts.continue}</Typography>
                        <img src="/images/arrow-left.svg" className="send-group-gp-icon" />
                    </button>
                ) : (
                    <button
                        style={{
                            bottom: '2%',
                            position: isInDesktop ? 'absolute' : 'fixed',
                        }}
                        onClick={() => setIsGroupSending(true)}
                        className="group-gp-button"
                    >
                        <img src="/images/group-gp.svg" className="group-gp-icon" />
                    </button>
                )}

                {/**list of students to send a gp to */}
                <Scrollable dir="topToBottom" containerRef={containerRef}>
                    {/**container for the infinite scroll in GoodPointReceiverList */}
                    <div id="scrollableDiv" ref={containerRef} className="custom-scroll-bar send-gp-container">
                        {/* *search bar  */}
                        <Box marginBottom={isGroupSending ? '1rem' : 0} className="send-gp-sticky-header">
                            {(scrollDirection === 'up' || isInDesktop) && (
                                <TextField
                                    className="fade-in"
                                    value={filterName}
                                    onChange={onFilterChange}
                                    variant="standard"
                                    style={{ width: '85%' }}
                                    InputProps={{
                                        sx: {
                                            '& input': {
                                                textAlign: 'center',
                                                fontSize: '1.6rem',
                                                color: theme.customColors.blue,
                                                //for some some rtl is ltr and vice versa -_-
                                                direction: 'ltr',
                                            },
                                        },
                                    }}
                                    placeholder={i18n.sendingGpListTexts.nameOfTeacherOrStudent}
                                />
                            )}

                            {/**list of users that were selected for the group messaging */}
                            {isGroupSending && !!groupMessageReceivers?.length && (
                                <Box className="send-gp-sticky-users-nav" height={'2rem'}>
                                    <UsersNav removeReceiver={removeReceiver} students={groupMessageReceivers ?? []} />
                                </Box>
                            )}
                        </Box>

                        <>
                            {/**list of users to send a gp to */}
                            <GoodPointReceiverList
                                messageReceivers={groupMessageReceivers ?? []}
                                handleGroupMessageReceiverSelect={handleGroupMessageReceiverSelect}
                                isTyping={isTyping}
                                filterName={filterName}
                            />
                        </>
                    </div>
                </Scrollable>
            </Box>
        </>
    );
};
