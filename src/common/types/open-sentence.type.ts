import { Gender, PresetCategory } from '../enums';

export type OpenSentence = {
    created: string;
    gender: Gender;
    id: number;
    lang: string;
    presetCategory: PresetCategory;
    schoolId: number;
    text: string;
};
