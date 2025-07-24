import { Gender, PresetCategory } from '../../../../../common/enums';

export type PmRow = {
    id: number;
    created: string;
    gender: Gender;
    lang: string;
    presetCategory: PresetCategory;
    schoolId: number;
    text: string;
    creatorId?: string;
    numOfUses: string;
};
