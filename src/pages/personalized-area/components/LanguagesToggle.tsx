import React from 'react';

import { FormSelect, FormToggleGroup } from '@hilma/forms';
import LanguageIcon from '@mui/icons-material/Language';

import { useTheme } from '@mui/material';
import { getLanguageName } from '../../../common/functions/getLanguageName';
import { DEFAULT_LANG } from '../../../i18n/i18n-consts';
import { Language } from '../../../i18n/init-i18n';

/**
 * @returns a stateless container for switching languages with basic functionality
 */
const LanguagesToggle: React.FC = () => {
    const theme = useTheme();

    // iteration over the code Languages enumeration and adding name of the lang and styles for the toggle
    const options = (Object.keys(Language) as Array<keyof typeof Language>).map((key) => ({
        //content:
        value: Language[key],
        content: getLanguageName(String(Language[key])) ?? DEFAULT_LANG,
        //styles:
        chosenTextColor: theme.customColors.dark_blue1,
        chosenSx: {
            backgroundColor: theme.customColors.off_white,
        },
        textColor: theme.customColors.off_white,
    }));

    return (
        <>
            {options.length <= 3 ? (
                <FormToggleGroup name="languagesToggle" options={options} rounded={true} />
            ) : (
                <FormSelect
                    name="languagesToggle"
                    options={options}
                    IconComponent={() => <LanguageIcon style={{ color: '#A2C4C4' }} />}
                />
            )}
        </>
    );
};

export default LanguagesToggle;
