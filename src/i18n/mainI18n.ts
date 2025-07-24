import { TranslatedI18n } from '@hilma/i18n';

import { createI18nHooksAndProvider } from '@hilma/i18n';
import { createRef } from 'react';
import { createI18n, Language } from './init-i18n';
import {
    adminClassesTable,
    adminTableDeletePopup,
    adminTopBar,
    alphabet,
    chatTexts,
    errors,
    excelTexts,
    gender,
    general,
    loginText,
    menuSideBarText,
    navbar,
    openSentencesBar,
    pagesTitles,
    personalizedAreaText,
    presetMessagesBank,
    reactionsTexts,
    receivedGpsTexts,
    reportText,
    SchoolGradesTexts,
    searchTeachersAndStudents,
    sendingGoodPointList,
    studentsTable,
    superAdmin,
    teacherActivityTexts,
    teachersTable,
    unsubscribeTexts,
} from './texts';

const i18n = createI18n({
    schoolGrades: SchoolGradesTexts,
    sendingGoodPointList,
    general,
    alphabet,
    teacherActivity: teacherActivityTexts,
    searchTeachersAndStudents,
    navbar,
    errors,
    chatTexts,
    openSentencesBar,
    menuSideBarText,
    loginText,
    reactionsTexts,
    personalizedAreaText,
    reportText,
    presetMessagesBank,
    receivedGpsTexts,
    studentsTable,
    adminTopBar,
    gender,
    adminTableDeletePopup,
    pagesTitles,
    superAdmin,
    teachersTable,
    excelTexts,
    adminClassesTable,
    unsubscribeTexts,
}); // Put here all the texts you want to translate

export const {
    I18nProvider,
    contexts,
    useLanguage,
    createI18nHook,
    isLanguage,
    useChangeLanguage,
    useDirection,
    useLanguageEffect,
    useNoLanguagePathname,
    usePathLanguage,
    useSwitchedPath,
    useTransform,
    useTransformObject,
    createTranslateHook,
} = createI18nHooksAndProvider(Language, i18n);

export type I18n = typeof i18n;

export const useI18n = createI18nHook<I18n>();
export const useTranslate = createTranslateHook<I18n>();
export const createI18nRef = () => createRef<TranslatedI18n<I18n>>(); // you can use this if you want to access the translation inside stores.
