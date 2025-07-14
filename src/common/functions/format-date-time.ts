export const formatDateTime = (date: Date, type: 'full' | 'hours' | 'date') => {
    const minutes: string = String(date.getMinutes()).padStart(2, '0');
    if (type === 'hours') return date.getHours() + ':' + minutes;
    else {
        const dayMonthYear = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        if (type === 'full') return date.getHours() + ':' + minutes + ' | ' + dayMonthYear;
        else if (type === 'date') return dayMonthYear;
    }
};
