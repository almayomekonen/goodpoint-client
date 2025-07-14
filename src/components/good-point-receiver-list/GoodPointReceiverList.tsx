import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { STUDENTS_FETCH_LIMIT } from '../../common/consts/fetching-limits';
import { useGroupMessage } from '../../common/contexts/GroupMessageContext';
import { useSendGpModal } from '../../common/contexts/SendGpModalContext';
import { getStudentDataLength } from '../../common/functions/getStudentsDataLength';
import { isDesktop } from '../../common/functions/isDesktop';
import { ChatStudent } from '../../common/types/chat-student.type';
import { GroupMessageReceiver } from '../../common/types/group-message-receiver.type';
import { UserCardType } from '../../common/types/sending-good-points-user-card.type';
import { useI18n } from '../../i18n/mainI18n';
import { LoaderCard } from '../loader-card/LoaderCard';
import { UserCard } from '../user-card/UserCard';
import { useQueryName } from '../../common/contexts/StudentListQueryContext';
import './good-point-receiver-list.scss';

interface GoodPointReceiverListProps {
    filterName: string;
    isTyping: boolean;
    handleGroupMessageReceiverSelect: (newUser: GroupMessageReceiver) => void;
    messageReceivers: GroupMessageReceiver[];
}
export const GoodPointReceiverList: React.FC<GoodPointReceiverListProps> = ({
    filterName,
    isTyping,
    handleGroupMessageReceiverSelect,
    messageReceivers,
}) => {
    const sendingGoodPointListTexts = useI18n((i18n) => i18n.sendingGoodPointList);
    const navigate = useNavigate();
    const [isFirstFetch, setIsFirstFetch] = useState(true);
    const { isGroupSending } = useGroupMessage();
    const gpModal = useSendGpModal();
    const { setStudentsQueryName } = useQueryName();

    const {
        isSuccess,
        data: usersPages,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage,
        isFetching,
    } = useInfiniteQuery<{ [key: string]: UserCardType[] }>(
        ['studentsFreeSearch', filterName],
        ({ pageParam = 1 }) =>
            axios<{ [key: string]: UserCardType[] }>(`/api/schools/get-students-of-school`, {
                params: {
                    pageNumber: pageParam,
                    filterName: filterName.trim(),
                    perPage: STUDENTS_FETCH_LIMIT,
                },
            }).then((res) => res.data),
        {
            getNextPageParam: (lastPage, allPages) => {
                const lastLength = getStudentDataLength([lastPage]);
                if (lastLength < STUDENTS_FETCH_LIMIT) return undefined;
                return allPages.length + 1;
            },
            refetchOnMount: false,
            enabled: !isTyping,
        },
    );

    const dataLength = getStudentDataLength(usersPages?.pages);

    useEffect(() => {
        if (usersPages) setIsFirstFetch(false);
    }, [usersPages]);

    function navigateToChat(user: ChatStudent) {
        if (gpModal) gpModal.setIsModalOpen(false);
        if (user.class) {
            setStudentsQueryName(['students', user.class.grade, user.class.classIndex].join('-'));
        }
        navigate('/send-gp-chat', { state: { ...user } });
    }

    if (isFirstFetch && isFetching && !isRefetching) {
        return (
            <Box className="good-point-receiver-list">
                {Array.from({ length: 20 }, (_, index) => {
                    return <LoaderCard key={index} type="user-card" />;
                })}
            </Box>
        );
    }
    return (
        <>
            {isFetching && !isSuccess && <CircularProgress size="5rem" className="loading-icon" />}

            {!dataLength && isSuccess && (
                <Typography className="center-in-container no-students-found-message" fontSize="2rem">
                    {sendingGoodPointListTexts.noStudentsFound}
                </Typography>
            )}

            <InfiniteScroll
                scrollThreshold={0.6}
                dataLength={dataLength}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={<></>}
                scrollableTarget="scrollableDiv"
            >
                <Box className="good-point-receiver-list">
                    {usersPages?.pages.map((studentsObj, objIndex, PagesArr) =>
                        Object.keys(studentsObj).map((letter, index) => {
                            let showLetter = true;
                            if (index === 0 && objIndex > 0) {
                                const previousLetter = Object.keys(PagesArr[objIndex - 1]).at(-1);
                                if (previousLetter === letter) showLetter = false;
                            }

                            return (
                                <Box key={index} className="good-point-receiver-letter-group">
                                    {showLetter && !isGroupSending && (
                                        <Typography className="group-letter">{letter}</Typography>
                                    )}
                                    <Box className="good-point-receiver-students-group">
                                        {studentsObj[letter].map((user) => {
                                            const card = (
                                                <UserCard
                                                    checkbox={isGroupSending}
                                                    isChecked={messageReceivers.some(
                                                        (currUser) => currUser.id === user.id,
                                                    )}
                                                    onCheckBoxChange={() =>
                                                        handleGroupMessageReceiverSelect({
                                                            id: user.id as number,
                                                            firstName: user.firstName,
                                                            lastName: user.lastName,
                                                            gpCount: user.gpCount,
                                                            gender: user.gender,
                                                            class: { ...user.class },
                                                        })
                                                    }
                                                    cardType="user-class-gpCount"
                                                    firstName={user.firstName}
                                                    lastName={user.lastName}
                                                    classRoom={user.class}
                                                    gpCount={user.gpCount}
                                                />
                                            );

                                            if (isGroupSending)
                                                return (
                                                    <div key={user.id}>
                                                        {card}
                                                        <Box className="user-card-border-bottom" width={'100%'} />
                                                    </div>
                                                );
                                            else
                                                return (
                                                    <button
                                                        onClick={() => navigateToChat(user as ChatStudent)}
                                                        className="clean-no-style-button"
                                                        key={user.id}
                                                    >
                                                        {card}
                                                        {isDesktop() && (
                                                            <Box className="user-card-border-bottom" width={'100%'} />
                                                        )}
                                                    </button>
                                                );
                                        })}
                                    </Box>
                                </Box>
                            );
                        }),
                    )}
                </Box>
                {isFetchingNextPage && (
                    <Box padding="1rem">
                        <CircularProgress />
                    </Box>
                )}
            </InfiniteScroll>
        </>
    );
};
