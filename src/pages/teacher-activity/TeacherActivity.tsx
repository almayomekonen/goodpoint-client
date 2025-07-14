import { Box } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FC } from 'react';
import { ReactionModalContext } from '../../common/contexts/ReactionModalContext';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
import { DatedGoodPointsFeed } from '../../components/dated-good-points-feed/DatedGoodPointsFeed';
import { useI18n } from '../../i18n/mainI18n';
import './teacher-activity.scss';

const TEACHER_ACTIVITY_FETCH_LIMIT = 50;
export interface TeacherActivityProps {
    children?: React.ReactNode;
    listType: 'teacher-activity-students' | 'teacher-activity-teachers';
}

/** This page shows the teacher activity feed, which is a feed of good points given by teachers to students or teachers.
 *
 * @param listType the type of the list to show, either "teacher-activity-students" or "teacher-activity-teachers"
 * @returns
 */
export const TeacherActivity: FC<TeacherActivityProps> = ({ children, listType }) => {
    const i18n = useI18n((i18n) => i18n.pagesTitles);

    const {
        data: goodPointsPages,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isError,
        isSuccess,
    } = useInfiniteQuery(
        ['teacher-activity', listType],
        ({ pageParam = 1 }) =>
            axios(`/api/staff/teacher-activity/${listType === 'teacher-activity-students' ? 'students' : 'teachers'}`, {
                params: {
                    pageNumber: pageParam,
                    perPage: TEACHER_ACTIVITY_FETCH_LIMIT,
                },
            }).then((res) => res.data),
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < TEACHER_ACTIVITY_FETCH_LIMIT) return undefined;
                return allPages.length + 1;
            },
            refetchOnMount: false,
        },
    );

    return (
        <Box width={'100%'} height={'100%'}>
            <HelmetTitlePage title={i18n.teacherActivity} />
            <ReactionModalContext>
                {children}
                <DatedGoodPointsFeed
                    isSuccess={isSuccess}
                    isError={isError}
                    hasNextPage={!!hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    listType={listType}
                    goodPoints={goodPointsPages?.pages.flat(1)}
                />
            </ReactionModalContext>
        </Box>
    );
};
