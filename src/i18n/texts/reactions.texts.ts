import { EmojiSender } from '../../common/types/emoji-sender.type';
import { createI18nText } from '../init-i18n';

export const reactionsTexts = createI18nText({
    he: {
        [EmojiSender.MOM]: 'אמא של',
        [EmojiSender.DAD]: 'אבא של',
        [EmojiSender.STUDENT]: '',
        [EmojiSender.OTHER]: 'אחר',
        sendAReaction: 'יש לסמן מי שולח התגובה ולבחור אימוגי שישלח',
        toSend: 'שליחה',
        continueConvoOnWhatsapp: 'להמשך השיחה עם המורה',
        gpReactionWhatsappMessage: 'בהמשך לנקודה הטובה ששלחת ל',
    },
    ar: {
        [EmojiSender.MOM]: 'אמא של',
        [EmojiSender.DAD]: 'אבא של',
        [EmojiSender.STUDENT]: '',
        [EmojiSender.OTHER]: 'אחר',
        sendAReaction: 'יש לסמן מי שולח התגובה ולבחור אימוגי שישלח',
        toSend: 'שליחה',
        continueConvoOnWhatsapp: 'להמשך השיחה עם המורה',
        gpReactionWhatsappMessage: 'בהמשך לנקודה הטובה ששלחת ל',
    },
});
