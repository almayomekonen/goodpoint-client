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

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
        if (doesUserExist) removeReceiver(newUser.id);
        else addReceiver(newUser);
    }

    function handleGroupMessage() {
        if (!groupMessageReceivers || groupMessageReceivers.length === 0) return;

        if (isInDesktop) {
            setIsModalOpen(false);
            setIsGroupSending(false);
        }

        if (groupMessageReceivers.length > 1) {
            // For group messages, always use absolute path
            navigate('/send-gp-chat-group');
        } else {
            const user = groupMessageReceivers[0];
            if (user.class) {
                setStudentsQueryName(['students', user.class.grade, user.class.classIndex].join('-'));
            }

            // FIXED: Use relative path for desktop, absolute for mobile
            const navigationPath = isInDesktop ? 'send-gp-chat' : '/send-gp-chat';
            console.log('🔍 Group navigation path:', navigationPath);

            navigate(navigationPath, {
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
                <HelmetTitlePage title={i18n.pagesTitles.sendingGoodPointList} />

                <Box width={'100%'} className="sending-good-point-list-header">
                    <Typography sx={{ direction: 'rtl' }} className="sending-good-point-list-users-container-header">
                        {isGroupSending
                            ? i18n.sendingGpListTexts.chooseGroupMessageReceivers
                            : '? ' + i18n.sendingGpListTexts.forWho}
                    </Typography>
                </Box>

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

                <Scrollable dir="topToBottom" containerRef={containerRef}>
                    <div id="scrollableDiv" ref={containerRef} className="custom-scroll-bar send-gp-container">
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
                                                direction: 'ltr',
                                            },
                                        },
                                    }}
                                    placeholder={i18n.sendingGpListTexts.nameOfTeacherOrStudent}
                                />
                            )}

                            {isGroupSending && !!groupMessageReceivers?.length && (
                                <Box className="send-gp-sticky-users-nav" height={'2rem'}>
                                    <UsersNav removeReceiver={removeReceiver} students={groupMessageReceivers ?? []} />
                                </Box>
                            )}
                        </Box>

                        <>
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
