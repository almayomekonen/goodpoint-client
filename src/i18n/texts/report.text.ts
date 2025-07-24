import { createI18nText } from '../init-i18n';
import { RADIO_OPTIONS } from '../../common/consts/export-report-radio-options';
export const reportText = createI18nText({
    he: {
        title: 'ייצוא דוח',
        success: 'הדוח ירד בהצלחה',
        sendSuccess: 'הדוח נשלח בהצלחה',
        reportStudent: 'דוח תלמיד',
        reportGrade: 'דוח כיתה',
        labels: {
            chooseGrade: 'בחר כיתה',
            forWho: 'עבור מי לייצא?',
            dates: 'עבור אילו תאריכים?',
            sendToEmail: 'מייל לשליחת קובץ ',
            add: 'הוספה',
        },
        placeHolders: {
            choose: 'בחירה',
            from: 'ממתי',
            to: 'עד מתי',
            searchByName: 'חיפוש לפי שם',
            emailExample: 'example@example.com',
        },
        radioOptions: {
            [RADIO_OPTIONS.ALL_STUDENTS]: 'יצא לכל הכיתה',
            [RADIO_OPTIONS.CHOOSE_STUDENT]: 'ייצוא לתלמיד',
        },
        errors: {
            exportErrorWhileSending: 'אירעה שגיאה בזמן השליחה',
            gradeBeforeStudent: 'יש לבחור כיתה לפני בחירת תלמיד',
            noClasses: 'לא נמצאו כיתות להצגה',
            noGoodPoints: 'לא נמצאו נקודות טובות בתאריכים שנבחרו',
        },
    },
    ar: {
        title: 'ייצוא דוח',
        success: 'הדוח ירד בהצלחה',
        sendSuccess: 'הדוח נשלח בהצלחה',
        reportStudent: 'דוח תלמיד',
        reportGrade: 'דוח כיתה',
        labels: {
            chooseGrade: 'בחר כיתה',
            forWho: 'עבור מי לייצא?',
            dates: 'עבור אילו תאריכים?',
            sendToEmail: 'מייל לשליחת קובץ ',
            add: 'הוספה',
        },
        placeHolders: {
            choose: 'בחירה',
            from: 'ממתי',
            to: 'עד מתי',
            searchByName: 'חיפוש לפי שם',
            emailExample: 'example@example.com',
        },
        radioOptions: {
            [RADIO_OPTIONS.ALL_STUDENTS]: 'יצא לכל הכיתה',
            [RADIO_OPTIONS.CHOOSE_STUDENT]: 'ייצוא לתלמיד',
        },
        errors: {
            exportErrorWhileSending: 'אירעה שגיאה בזמן השליחה',
            gradeBeforeStudent: 'יש לבחור כיתה לפני בחירת תלמיד',
            noClasses: 'לא נמצאו כיתות להצגה',
            noGoodPoints: 'לא נמצאו נקודות טובות בתאריכים שנבחרו',
        },
    },
});
