import { Language } from '../../i18n/init-i18n';

export type TeacherDetails = {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber?: string;
    systemNotifications?: boolean;
    languagesToggle?: Language;
};
