import { Gender, PresetCategory } from '../../../common/enums';

export type PmInfo = {
    id: number;
    gender: Gender;
    presetCategory: PresetCategory;
    text: string;
};
