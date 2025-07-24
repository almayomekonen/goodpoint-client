import { TeacherActivityStudentGp } from './teacher-activity-good-point.type';
import { TeacherReceivedGoodPoints } from './teacher-received-good-points.type';

export interface DatedGps {
    isFetchingNextPage?: boolean;
    fetchNextPage: () => any;
    hasNextPage: boolean;
    isError?: boolean;
    isSuccess: boolean;
}
export type gpReceiver = {
    receiver: {
        firstName: string;
        lastName: string;
    };
};

export type TeacherToTeacherGps = TeacherReceivedGoodPoints & gpReceiver;

export interface TeacherToStudentActivityProps extends DatedGps {
    listType: 'teacher-activity-students';
    goodPoints: TeacherActivityStudentGp[] | undefined;
}

export interface ReceivedGpsProps extends DatedGps {
    listType: 'received-good-points';
    goodPoints: TeacherReceivedGoodPoints[] | undefined;
}

export interface TeacherToTeacherActivityProps extends DatedGps {
    listType: 'teacher-activity-teachers';
    goodPoints: TeacherToTeacherGps[] | undefined;
}

export type DatedGpsProps = TeacherToStudentActivityProps | ReceivedGpsProps | TeacherToTeacherActivityProps;
