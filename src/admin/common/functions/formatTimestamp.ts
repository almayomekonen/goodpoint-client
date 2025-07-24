/**
 * Formats a timestamp into a string in the format "dd.mm.yy".
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */

export const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('HE', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\./g, '/');
};
