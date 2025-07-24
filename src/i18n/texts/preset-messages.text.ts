import { createI18nText } from '../init-i18n';

export const presetMessagesBank = createI18nText({
    he: {
        deleteMessagePopup: {
            title: 'האם ברצונך למחוק משפט זה ?',
        },
        addMessagePopup: {
            title: 'הוספת משפט',
            content: 'יש לכתוב את המשפט הרצוי ולבחור מגדר וקטגוריה רלוונטים לו',
            warningTextMale: 'המשפט צריך לכלול את המילה "התלמיד"',
            warningTextFemale: 'המשפט צריך לכלול את המילה "התלמידה"',
            enterMessage: 'משפט חדש כאן',
            chooseCategory: 'קטגורית משפט',
            addOpeningMessage: 'הוספת משפט פתיחה',
        },
        excelPopUp: {
            excel: 'הוספה באמצעות אקסל',
            addExcel: 'העלאת קובץ משפטי פתיחה',
            addExcelSuccess: 'משפטי פתיחה',
            theyExist: 'כל משפטי הפתיחה קיימים במערכת',
            fieldsInsideCategory: ' קטגריות האפשריות למשפטי פתיחה הן:',
            FieldsObject: {
                text: 'טקסט',
                gender: 'מגדר/מין',
                category: 'קטגוריה',
            },
        },
        admin: {
            filterByGender: 'סינון לפי מגדר',
            filterByCategory: 'סינון לפי קטגוריה',
            filterByCreator: 'סינון לפי מחבר',
        },
    },
    ar: {
        deleteMessagePopup: {
            title: 'האם ברצונך למחוק משפט זה ?',
        },
        addMessagePopup: {
            title: 'הוספת משפט',
            content: 'יש לכתוב את המשפט הרצוי ולבחור מגדר וקטגוריה רלוונטים לו',
            warningTextMale: 'המשפט צריך לכלול את המילה "התלמיד"',
            warningTextFemale: 'המשפט צריך לכלול את המילה "התלמידה"',
            enterMessage: 'הכנס משפט חדש',
            chooseCategory: 'בחר קטגוריה',
            addOpeningMessage: 'הוספת משפט פתיחה',
        },
        excelPopUp: {
            excel: 'הוספה באמצעות אקסל',
            addExcel: 'העלאת קובץ משפטי פתיחה',
            addExcelSuccess: 'משפטי פתיחה',
            theyExist: 'כל משפטי הפתיחה קיימים במערכת',
            fieldsInsideCategory: ' קטגריות האפשריות למשפטי פתיחה הן:',
            FieldsObject: {
                text: 'טקסט',
                gender: 'מגדר/מין',
                category: 'קטגוריה',
            },
        },
        admin: {
            filterByGender: 'סינון לפי מגדר',
            filterByCategory: 'סינון לפי קטגוריה',
            filterByCreator: 'סינון לפי מחבר',
        },
    },
});
