//TODO: not sure what this regex does
// eslint-disable-next-line
export const FIRST_LAST_NAME_REGEX = '^[a-zA-Zא-ת \u0621-\u064A \'"`”()’-]+$';
export const STRONG_PASSWORD = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])');
export const EMAIL_REGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
