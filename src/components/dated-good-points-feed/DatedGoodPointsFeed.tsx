import { FC, useEffect, useRef } from 'react';

import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isSameDay } from '../../common/functions/compareDates';
import { formatDateTime } from '../../common/functions/format-date-time';
import { isDesktop } from '../../common/functions/isDesktop';
import { isToday } from '../../common/functions/isToday';
import { useStickyDateControls } from '../../common/hooks/use-sticky-date-controls';
import { DatedGpsProps, TeacherToTeacherGps } from '../../common/types/dated-gps-feed.types';
import { TeacherActivityStudentGp } from '../../common/types/teacher-activity-good-point.type';
import { TeacherReceivedGoodPoints } from '../../common/types/teacher-received-good-points.type';
import { useI18n } from '../../i18n/mainI18n';
import { Scrollable } from '../scrollable/Scrollable';
import { UserCard } from '../user-card/UserCard';

import './dated-good-points-feed.scss';

export const DatedGoodPointsFeed: FC<DatedGpsProps> = ({
    goodPoints,
    listType,
    fetchNextPage,
    hasNextPage,
    isError,
    isSuccess,
}) => {
    const { generalTexts, teacherActivityTexts, receivedGpsTexts } = useI18n((i) => ({
        generalTexts: i.general,
        teacherActivityTexts: i.teacherActivity,
        receivedGpsTexts: i.receivedGpsTexts,
    }));
    const containerRef = useRef<HTMLDivElement>(null);
    const isInDesktop = isDesktop();

    const animationControls = useStickyDateControls(containerRef, [listType]);

    useEffect(() => {
        containerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }, [listType]);

    function buildGpList() {
        if (!goodPoints) return;
        const gpDateBlocks: (TeacherActivityStudentGp | TeacherToTeacherGps | TeacherReceivedGoodPoints)[][] = [];
        let i = 0;
        while (i < goodPoints?.length) {
            const currDateBlock = [goodPoints[i]];
            while (
                i + 1 < goodPoints.length &&
                isSameDay(new Date(goodPoints[i].created), new Date(goodPoints[i + 1].created))
            )
                currDateBlock.push(goodPoints[++i]);

            gpDateBlocks.push(currDateBlock);
            i++;
        }

        return gpDateBlocks;
    }

    return (
        <>
            <Scrollable containerRef={containerRef} dir="bottomToTop">
                <Box width={'100%'} height="100%" position="relative">
                    <Box
                        paddingBottom={!isInDesktop && listType != 'received-good-points' ? '4rem' : '1rem'}
                        className="flex-column-overflow dated-gps-container custom-scroll-bar"
                        ref={containerRef}
                        id="scrollableTarget"
                    >
                        <InfiniteScroll
                            scrollThreshold={0.6}
                            inverse={true}
                            style={{ display: 'flex', flexDirection: 'column-reverse' }}
                            dataLength={goodPoints?.length || 0}
                            loader={
                                <Typography marginBottom={'-2rem'} textAlign="center">
                                    {generalTexts.loading}
                                </Typography>
                            }
                            hasMore={hasNextPage}
                            next={() => fetchNextPage()}
                            scrollableTarget="scrollableTarget"
                        >
                            <Box className="gp-feed-gp-list">
                                {/**error messages  */}
                                <Box textAlign="center" className="center-in-container">
                                    {goodPoints?.length === 0 || isError ? (
                                        <Typography fontSize="1.5rem">
                                            {listType != 'received-good-points'
                                                ? teacherActivityTexts.noMessagesYet
                                                : receivedGpsTexts.noReceivedMessages}
                                        </Typography>
                                    ) : (
                                        !isSuccess && (
                                            <Box className="gp-feed-loader-message center-in-container">
                                                <CircularProgress size="4vh" />
                                            </Box>
                                        )
                                    )}
                                </Box>

                                {goodPoints && goodPoints[0] && !isToday(new Date(goodPoints[0].created)) && (
                                    <Box height={'10rem'} className="today-messages-header">
                                        <Typography marginBottom="1.5rem" className="today-messages-header-title">
                                            {generalTexts.today}
                                        </Typography>
                                        <Typography>
                                            {listType != 'received-good-points'
                                                ? teacherActivityTexts.noMessagesToday
                                                : receivedGpsTexts.noReceivedMessages}
                                        </Typography>
                                    </Box>
                                )}

                                {buildGpList()?.map((gpDateBlock, index) => {
                                    const date = new Date(gpDateBlock[0].created);
                                    return (
                                        <Stack
                                            data-date={formatDateTime(date, 'date')}
                                            key={index}
                                            width="100%"
                                            direction="column-reverse"
                                            alignItems="center"
                                            justifyContent="center"
                                            rowGap="1rem"
                                        >
                                            {gpDateBlock.map((gp) => {
                                                const date = new Date(gp.created);
                                                let userCard;
                                                let teacherActivityGp;
                                                let teachersGp;
                                                switch (listType) {
                                                    case 'teacher-activity-students':
                                                        teacherActivityGp = gp as TeacherActivityStudentGp;
                                                        userCard = (
                                                            <UserCard
                                                                cardType="user-activity"
                                                                description={gp.gpText}
                                                                date={date}
                                                                firstName={teacherActivityGp.student.firstName}
                                                                lastName={teacherActivityGp.student.lastName}
                                                                reactions={teacherActivityGp.reactions ?? []}
                                                                receiver={{
                                                                    firstName: teacherActivityGp.student.firstName,
                                                                    lastName: teacherActivityGp.student.lastName,
                                                                }}
                                                                key={gp.id}
                                                            />
                                                        );
                                                        break;

                                                    case 'received-good-points':
                                                        gp = gp as TeacherReceivedGoodPoints;
                                                        userCard = (
                                                            <UserCard
                                                                cardType="received-good-points"
                                                                description={gp.gpText}
                                                                date={date}
                                                                firstName={gp.sender?.firstName}
                                                                lastName={gp.sender?.lastName}
                                                                reaction={gp.reaction?.emoji}
                                                                className="received-user-card-container"
                                                                key={gp.id}
                                                                gpId={gp.id}
                                                            />
                                                        );
                                                        break;

                                                    case 'teacher-activity-teachers':
                                                        teachersGp = gp as TeacherToTeacherGps;
                                                        userCard = (
                                                            <UserCard
                                                                receiver={{
                                                                    firstName: teachersGp.receiver.firstName,
                                                                    lastName: teachersGp.receiver.lastName,
                                                                }}
                                                                cardType="user-activity-teachers"
                                                                description={teachersGp.gpText}
                                                                date={date}
                                                                firstName={teachersGp.receiver.firstName}
                                                                lastName={teachersGp.receiver.lastName}
                                                                reaction={teachersGp.reaction?.emoji}
                                                                className="received-user-card-container"
                                                                key={gp.id}
                                                            />
                                                        );
                                                        break;
                                                }
                                                return userCard;
                                            })}

                                            {/**date of gps  */}
                                            <motion.div animate={animationControls} className="sticky-date-container">
                                                <Typography
                                                    marginBottom="0.6rem"
                                                    className="today-messages-header-title"
                                                >
                                                    {isToday(date) ? generalTexts.today : formatDateTime(date, 'date')}
                                                </Typography>
                                            </motion.div>
                                        </Stack>
                                    );
                                })}
                            </Box>
                        </InfiniteScroll>
                    </Box>
                </Box>
            </Scrollable>
        </>
    );
};
