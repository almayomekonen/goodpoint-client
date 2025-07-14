import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FC, useEffect } from 'react';
import { useUser } from '../../common/contexts/UserContext';
import { TeacherReceivedGoodPoints } from '../../common/types/teacher-received-good-points.type';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
import { DatedGoodPointsFeed } from '../../components/dated-good-points-feed/DatedGoodPointsFeed';
import { useI18n } from '../../i18n/mainI18n';
import './received-good-points.scss';
const TEACHER_RECEIVED_GPS_FETCH_LIMIT = 50;

/**
 * Component: ReceivedGoodPoints
 * ----------------------------
 * This component represents the received good points page for teachers. It displays a feed of dated good points
 * received by the teacher. The feed can be paginated and refreshed.
 *
 * @returns {JSX.Element} The ReceivedGoodPoints component JSX element.
 */
export const ReceivedGoodPoints: FC = () => {
    const i18n = useI18n((i18n) => i18n.pagesTitles);
    const { setUser } = useUser();
    const {
        data: gps,
        isSuccess,
        fetchNextPage,
        hasNextPage,
        isError,
        isFetchingNextPage,
    } = useInfiniteQuery(
        ['teacher-received-gps'],
        ({ pageParam = 1 }) =>
            axios<TeacherReceivedGoodPoints[]>({
                url: '/api/teachers-good-points/received-good-points',
                params: {
                    perPage: TEACHER_RECEIVED_GPS_FETCH_LIMIT,
                    pageNumber: pageParam,
                },
            }).then((res) => res.data),
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < TEACHER_RECEIVED_GPS_FETCH_LIMIT) return undefined;
                return allPages.length + 1;
            },
        },
    );

    //when the teacher enters the page , we want to mark all the gps as read
    useEffect(() => {
        setUser((prev) => ({ ...prev, unreadGps: 0 }));
    }, []);

    return (
        <>
            <HelmetTitlePage title={i18n.receivedGoodPoints} />
            <DatedGoodPointsFeed
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isError={isError}
                isFetchingNextPage={isFetchingNextPage}
                goodPoints={gps?.pages.flat(1)}
                isSuccess={isSuccess}
                listType="received-good-points"
            />
        </>
    );
};
