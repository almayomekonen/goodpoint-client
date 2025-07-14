export const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
};

export const isNow = (date: Date) => {
    const now = new Date();
    return isToday(date) && now.getHours() === date.getHours() && now.getMinutes() === date.getMinutes();
};
