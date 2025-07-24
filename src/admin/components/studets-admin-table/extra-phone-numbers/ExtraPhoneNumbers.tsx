import React from 'react';

import { FormTextInput, useForm } from '@hilma/forms';

import { Delete } from '@mui/icons-material';
import { Button } from '@mui/material';
import clsx from 'clsx';
import { useI18n } from '../../../../i18n/mainI18n';
import { StudentRow } from '../../../common/types/table-type/row-interfaces';
import './extraPhoneNumbers.scss';

interface ExtraPhoneNumbersProps {
    countMax: number;
    className?: string;
}

/**
 *  A stateful component that displays extra phone numbers for a student.
 * @component
 * @param {number} countMax - Number of extra phone numbers the default is 0 if not provided
 * @returns {ReactNode} The rendered AddButtons component.
 */

const ExtraPhoneNumbers: React.FC<ExtraPhoneNumbersProps> = ({ countMax, className }) => {
    const { setFieldValue, values } = useForm<StudentRow>();

    function addNumber() {
        setFieldValue('relativesPhoneNumbers', [...values.relativesPhoneNumbers, { phone: '' }]);
    }

    function deleteNumber(i: number) {
        setFieldValue(
            'relativesPhoneNumbers',
            values.relativesPhoneNumbers.filter((_, index) => index !== i + 2),
        );
    }

    const phoneNumbersLabels = useI18n((i18n) => i18n.studentsTable.phoneNumbers);
    return (
        <>
            {Array(Math.max(values.relativesPhoneNumbers.length - 2, 0))
                .fill(null)
                .map((_, index) => {
                    const inputName = `relativesPhoneNumbers[${index + 2}].phone`;
                    return (
                        <FormTextInput
                            containerClassName={className}
                            key={inputName}
                            name={inputName}
                            label={`${phoneNumbersLabels.parentPhone} ${index + 3}`}
                            maxLength={10}
                            fast
                            endAdornment={<Delete className="delete-icon" onClick={() => deleteNumber(index)} />}
                        />
                    );
                })}
            {countMax > values.relativesPhoneNumbers.length && (
                <Button type="button" className={clsx('add-phone-numbers-btn', className)} onClick={addNumber}>
                    {phoneNumbersLabels.addPhone}
                </Button>
            )}
        </>
    );
};

export default ExtraPhoneNumbers;
