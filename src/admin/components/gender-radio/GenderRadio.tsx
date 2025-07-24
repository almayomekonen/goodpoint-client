import { FormRadioGroup } from '@hilma/forms';
import React from 'react';
import { useI18n } from '../../../i18n/mainI18n';
import { GenderArray } from '../../common/consts/GenderArray';
import clsx from 'clsx';

interface GenderRadioProps {
    title?: string;
    className?: string;
}

/**
A component that displays a radio group of gender options.
If no title is provided, default translated strings are used.
@param {string} [title] - The title of the radio group. Optional.
@return {JSX.Element} - The GenderRadio component.
*/

const GenderRadio: React.FC<GenderRadioProps> = ({ title, className }) => {
    // Use useI18n hook to retrieve default translated strings if title is not provided
    const { studentsTable, genderTrans } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            genderTrans: i18n.gender,
        };
    });

    return (
        <>
            <div className={clsx('radio-group-container', className)}>
                <label className="Form-radio-group-label" data-isrequired={true}>
                    {title ?? studentsTable.gender}
                </label>
                <FormRadioGroup
                    name="gender"
                    label={''}
                    options={Object.values(genderTrans).map((gender, i) => ({
                        value: GenderArray[i],
                        content: `${gender}`,
                    }))}
                />
            </div>
        </>
    );
};

export default GenderRadio;
