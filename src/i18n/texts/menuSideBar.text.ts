import { createI18nText } from '../init-i18n';

export type MenuSidebarText = keyof typeof menuSideBarText.he;

export const menuSideBarText = createI18nText({
    he: {
        home: 'בית',
        receivedGp: 'נקודות שקיבלתי',
        pointsIGave: 'נקודות שהענקתי',
        exportReport: 'ייצוא דוח',
        privetZone: 'איזור אישי',
        schoolsToPresent: 'בחירת מוסד להצגה',
        presetMessagesBank: 'מחסן משפטים',
        admin: 'מערכת ניהול',
        logout: 'התנתקות',
    },
    ar: {
        home: 'בית',
        receivedGp: 'الرسائل التي تلقيتها',
        pointsIGave: 'נקודות שהענקתי',
        exportReport: 'ייצוא דוח',
        privetZone: 'איזור אישי',
        schoolsToPresent: 'בחירת מוסד להצגה',
        presetMessagesBank: 'מחסן משפטים',
        admin: 'מערכת ניהול',
        logout: 'התנתקות',
    },
});
