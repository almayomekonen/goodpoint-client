/**
 * This function takes a javascript date object and converts it to a mysql datetime format
 * @param date the Date
 * @returns
 */
export function dateToDatetime(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
