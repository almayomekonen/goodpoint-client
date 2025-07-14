import { Emoji } from './emoji.type';
export type Reaction = {
    reaction: Emoji;
    sender: string;
    id: number;
};
