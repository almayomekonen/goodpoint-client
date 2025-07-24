import * as React from 'react';
import { useDirection, useI18n } from '../../i18n/mainI18n';
//components
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
//types && enum
import { SchoolGrades } from '../../common/enums';
import { DefaultGradeFilter } from '../../common/consts/MyClasses.consts';
import { ChosenGradeFilter } from '../../common/types/MyClasses.types';
//scss
import './myClassSelectInput.scss';

const ITEM_HEIGHT = 56;
const ITEM_PADDING_TOP = 8;

interface CheckboxSelectInputProps {
    options: SchoolGrades[];
    title: string;
    chosenGradeFilter: ChosenGradeFilter;
    setChosenGradeFilter: (val: ChosenGradeFilter) => void;
}

export const MyClassSelectInput: React.FC<CheckboxSelectInputProps> = ({
    options,
    chosenGradeFilter,
    setChosenGradeFilter,
}) => {
    const i18n = useI18n((i18n) => i18n.schoolGrades);

    const direction = useDirection();

    return (
        <div className="checkbox-select-input-wrapper">
            <FormControl className="checkbox-select-input-inner-wrapper" sx={{ m: 1, minWidth: 120 }}>
                <Select
                    value={chosenGradeFilter}
                    onChange={(e) => setChosenGradeFilter(e.target.value as ChosenGradeFilter)}
                    defaultValue={chosenGradeFilter}
                    inputProps={{ 'aria-label': 'Without label' }}
                    className="select-my-classes"
                    MenuProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                            width: 250,
                            direction,
                        },
                    }}
                    label={i18n.grade}
                    sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                >
                    <MenuItem className="MyClassSelectInput-menu-text" value={DefaultGradeFilter}>
                        {i18n.myClasses}
                    </MenuItem>
                    {options.map((val) => (
                        <MenuItem className="MyClassSelectInput-menu-text" key={`${val}`} value={val}>
                            {`${i18n.grade} ${i18n.gradesList[val]}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};
