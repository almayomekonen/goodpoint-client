import { Emoji } from '../types/emoji.type';

/**This function counts the number of each emoji in an array of emojis
 *
 *
 * @param emojisArr
 * @returns the count of each emoji in the array and the total count of emojis
 */
export const countEmojis = (emojisArr: Emoji[]) => {
    const res: Partial<Record<Emoji, number>> = {};
    emojisArr.forEach((emoji) => {
        if (res[emoji]) {
            res[emoji] = res[emoji]! + 1;
        } else {
            res[emoji] = 1;
        }
    });
    return { totalCount: emojisArr.length, emojisCount: res };
};
