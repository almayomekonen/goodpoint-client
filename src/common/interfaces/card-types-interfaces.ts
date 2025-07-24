import { SchoolGrades } from '../enums/school-grade.enum';
import { Emoji } from '../types/emoji.type';
import { Reaction } from '../types/reaction.type';

export interface UserGpCountProps {
    gpCount: number;
    lastName: string;
    firstName: string;
    grade?: SchoolGrades;
    cardType: 'user-gpCount';
}

export interface UserNameProps {
    firstName: string;
    lastName: string;
    cardType: 'user-name';
    reaction?: Emoji;
    grade?: SchoolGrades;
}

export interface UserClassGpCountProps {
    classRoom: {
        grade: SchoolGrades;
        classIndex: number;
    };
    lastName: string;
    firstName: string;
    gpCount: number;
    cardType: 'user-class-gpCount';
}

export interface ClassProps {
    classRoom: {
        grade: SchoolGrades;
        classIndex: number;
    };
    cardType: 'class';
    handleBookMark: () => void;
    isBookedMarked?: boolean;
}

export interface UserActivityProps {
    firstName: string;
    lastName: string;
    description: string;
    cardType: 'user-activity';
    reactions?: Reaction[];
    date: Date;
    receiver: {
        firstName: string;
        lastName: string;
    };
}

export interface ReceivedGoodPointProps {
    lastName: string;
    firstName: string;
    description: string;
    cardType: 'received-good-points';
    date: Date;
    reaction?: Emoji;
    senderId?: string;
}

export interface UserActivityTeachersProps {
    firstName: string;
    lastName: string;
    description: string;
    cardType: 'user-activity-teachers';
    reaction?: Emoji;
    date: Date;
    receiver: {
        firstName: string;
        lastName: string;
    };
}

export interface UserClassProps {
    firstName: string;
    lastName: string;
    cardType: 'user-class';
    classRoom: {
        grade: SchoolGrades;
        classIndex: number;
    };
}

export interface StudyGroupProps {
    cardType: 'study-group';
    handleBookMark: () => void;
    isBookedMarked?: boolean;
    name: string;
    iconText: string;
}

export interface BasicUserCardProps {
    highlight?: boolean;
    isHeader?: boolean;
    className?: string;
    onCheckBoxChange?: () => void;
    isChecked?: boolean;
    checkbox?: boolean;
    gpId?: number;
}

export type UserCardProps = (
    | UserGpCountProps
    | UserNameProps
    | UserClassGpCountProps
    | UserActivityProps
    | ReceivedGoodPointProps
    | UserActivityTeachersProps
    | UserClassProps
    | StudyGroupProps
    | ClassProps
) &
    BasicUserCardProps;
