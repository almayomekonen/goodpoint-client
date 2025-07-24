/**
 * Formats a phone number in the format "xxxxxxxxxx" and replace to 05
 * @param {string} phoneNumber - The phone number to format.
 * @param {string} isWhatsapp - boolean for whatsapp text
 * @returns {string} The formatted phone number or an empty string if the input is falsy.
 */

export function formatPhoneNumber(phoneNumber: string, isWhatsapp?: boolean): string {
    if (!phoneNumber) return '';
    if (isWhatsapp && phoneNumber.startsWith('0')) {
        phoneNumber = '972' + phoneNumber.slice(1);
    } else if (phoneNumber.startsWith('972')) {
        phoneNumber = '0' + phoneNumber.slice(3);
    }
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1$2$3');
}
