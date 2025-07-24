import { UserCardType } from '../types/sending-good-points-user-card.type';
export const getStudentDataLength = (students: { [key: string]: UserCardType[] }[] | undefined) => {
    if (!students) return 0;
    const count = students.reduce((GlobalAcc, StudentObjArr) => {
        const valuesArr = Object.values(StudentObjArr);
        const localValue =
            GlobalAcc +
            valuesArr.reduce((localAcc, studentLetterArr) => {
                return localAcc + studentLetterArr.length;
            }, 0);
        return localValue;
    }, 0);
    return count;
};
