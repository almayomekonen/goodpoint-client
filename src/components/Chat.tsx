import { Fragment, useEffect, useRef } from 'react';

import axios from 'axios';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useI18n } from '../i18n/mainI18n';
import { motion } from 'framer-motion';
import { GOOD_POINTS_FETCH_LIMIT } from '../common/consts';
import { useGpsSocket } from '../common/contexts/GpSocketContext';
import { isDesktop } from '../common/functions/isDesktop';
import { GoodPointInformation } from '../common/types';

import BubbleChat from './bubble-chat/BubbleChat';
import ErrorMessage from './error-message/ErrorMessage';
import Loading from './Loading';

import './chat.scss';
import { isSameDay } from '../common/functions/compareDates';
import { Typography } from '@mui/material';
import { formatDateTime } from '../common/functions/format-date-time';
import { isToday } from '../common/functions/isToday';
import { useStickyDateControls } from '../common/hooks/use-sticky-date-controls';

interface ChatProps {
    /**
     * When id is number, it means its a student.
     * string- teacher
     * number[] - group sending to students.
     */
    id: number | string | number[];
    handleScroll?: (e: React.UIEvent<HTMLElement>) => void;
    apiPath?: string;
    queryName: string;
    groupGp?: boolean;
    presetMessages?: boolean;
}

/** This component is the chat between either a student and a teacher, or a group of students and a teacher. This is where a teacher would send a good point.
 *
 * @param id - When id is number, it means its a student.
 * string- teacher
 * number[] - group sending to students.
 * @param handleScroll - A function that will be called when the user scrolls.
 * @param apiPath - The path to the api. If not given, the default is /api/good-points
 * @param queryName - The name of the query. If not given, the default is good-points
 * @param groupGp - If true, the chat will be a group chat.
 * @param presetMessages - If true, the chat will be a preset messages chat.
 *
 *
 *
 *
 */
function Chat({ id, handleScroll, apiPath, queryName, groupGp, presetMessages }: ChatProps) {
    const i18n = useI18n((i18n) => ({ error: i18n.errors, message: i18n.general, today: i18n.general.today }));

    const containerRef = useRef<HTMLDivElement>(null);
    const { didReceiveMessage } = useGpsSocket();

    const scrollToBottom = () =>
        containerRef.current?.scrollTo({
            top: containerRef.current?.scrollHeight,
        });

    const {
        data: goodPoints,
        fetchNextPage,
        status,
        refetch,
        hasNextPage,
    } = useInfiniteQuery(
        [queryName, id],
        async ({ pageParam = 0 }) => {
            if (groupGp) {
                // When using group-gp, we don't have any history.
                //When refreshing, if the students are the same students, we want to show the messages that were just sent.
                const sessionVar = sessionStorage.getItem('messagesSent');
                if (sessionVar) {
                    const chat: { messages: GoodPointInformation[]; student_ids: number[] } = JSON.parse(sessionVar);
                    const ids = chat.student_ids.sort();

                    if ((id as number[]).length == 0) {
                        //after refresh the array of ids first arrives empty and then fills up
                        return [];
                    }
                    if (JSON.stringify(ids) == JSON.stringify((id as number[]).sort())) {
                        return chat.messages;
                    }
                    sessionStorage.removeItem('messagesSent');
                    return [];
                } else {
                    return [];
                }
            }

            const { data } = await axios.get<GoodPointInformation[] | []>(`${apiPath}/${id}/${pageParam}`);

            return data;
        },
        {
            getNextPageParam: (lastPage, allPages) =>
                lastPage.length < GOOD_POINTS_FETCH_LIMIT ? undefined : allPages.length,
        },
    );

    const list = goodPoints?.pages.flat(1);
    const animationControls = useStickyDateControls(containerRef, [list]);

    useEffect(() => {
        scrollToBottom();
    }, [list?.[0]]);

    useEffect(() => {
        if (didReceiveMessage) {
            refetch();
        }
    }, [didReceiveMessage]);

    //building the good points  list grouped by date , assuming the good points are sorted by date
    function buildGpList() {
        const goodPointsList = goodPoints?.pages.flat(1);
        if (!goodPointsList) return;
        const gpDateBlocks: GoodPointInformation[][] = [];
        let i = 0;
        while (i < goodPointsList?.length) {
            const currDateBlock = [goodPointsList[i]];
            //checking if the next good point is from the same date
            while (
                i + 1 < goodPointsList.length &&
                isSameDay(new Date(goodPointsList[i].date), new Date(goodPointsList[i + 1].date))
            )
                currDateBlock.push(goodPointsList[++i]);

            gpDateBlocks.push(currDateBlock);
            i++;
        }
        return gpDateBlocks;
    }

    return (
        <div className="chat-container">
            {!status || status === 'loading' ? (
                <Loading />
            ) : status === 'error' ? (
                <ErrorMessage errorMessage={i18n.message.errorMessage} />
            ) : (
                <div
                    id="scrollableDiv"
                    className={clsx(
                        presetMessages && 'presetMessages',
                        isDesktop() && 'chat-desktop',
                        'custom-scroll-bar',
                    )}
                    onScroll={handleScroll ? handleScroll : undefined}
                    ref={containerRef}
                >
                    <InfiniteScroll
                        dataLength={goodPoints?.pages.flat(1)?.length || 0}
                        next={() => fetchNextPage()}
                        inverse={true}
                        hasMore={!!hasNextPage}
                        loader={''}
                        style={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                        }}
                        scrollableTarget="scrollableDiv"
                    >
                        {/**overflow hidden on container fixes issue with scroll bar showing when sending gp  */}
                        <TransitionGroup component={null} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                            <CSSTransition timeout={70000} classNames="item" key="a1" in={true}>
                                <div></div>
                            </CSSTransition>
                            {goodPoints && (
                                <Fragment>
                                    {!groupGp && !list?.length ? (
                                        <div className="no_gp_message">{i18n.error.noGpStudent}</div>
                                    ) : (
                                        buildGpList()?.map((gpDateBlock: GoodPointInformation[], index: number) => {
                                            const date = new Date(gpDateBlock[0].date);
                                            return (
                                                <div key={index} className="chat-gp-date-block">
                                                    {gpDateBlock.map((gp: GoodPointInformation) => {
                                                        return (
                                                            <CSSTransition
                                                                timeout={70000}
                                                                classNames="item"
                                                                key={gp.id}
                                                                in={true}
                                                            >
                                                                <BubbleChat
                                                                    containerRef={containerRef}
                                                                    goodPoint={gp}
                                                                />
                                                            </CSSTransition>
                                                        );
                                                    })}

                                                    {/**date of gps  */}
                                                    <motion.div
                                                        animate={animationControls}
                                                        className="chat-gp-sticky-date-container"
                                                    >
                                                        <Typography
                                                            marginBottom="0.6rem"
                                                            className="today-messages-header-title"
                                                        >
                                                            {isToday(date) ? i18n.today : formatDateTime(date, 'date')}
                                                        </Typography>
                                                    </motion.div>
                                                </div>
                                            );
                                        })
                                    )}
                                </Fragment>
                            )}
                        </TransitionGroup>
                    </InfiniteScroll>
                </div>
            )}
        </div>
    );
}
export default Chat;
