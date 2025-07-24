import { Emoji } from './emoji.type';

export interface TeacherReceivedGoodPoints {
    sender: {
        firstName: string;
        lastName: string;
        id: string;
    };
    gpText: string;
    created: string;
    id: number;
    reaction?: {
        emoji: Emoji;
        created?: string;
    };
}
