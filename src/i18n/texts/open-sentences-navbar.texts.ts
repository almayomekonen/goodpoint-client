import { PresetCategory } from '../../common/enums';
import { createI18nText } from '../init-i18n';

export const openSentencesBar = createI18nText({
    he: {
        all: 'הכל',
        [PresetCategory.educational]: 'לימודי',
        [PresetCategory.social]: 'חברתי',
        [PresetCategory.emotional]: 'רגשי',
        [PresetCategory.other]: 'אחר',
    },
    ar: {
        all: 'הכל',
        [PresetCategory.educational]: 'לימודי',
        [PresetCategory.social]: 'חברתי',
        [PresetCategory.emotional]: 'רגשי',
        [PresetCategory.other]: 'אחר',
    },
});
