import { useCallback } from 'react';
import { useI18n } from '../../../i18n/mainI18n';
import { excludedPMCategoryKey } from '../consts/excludedPMCategoryKey';

/**
 * `formatExcelErrors` is used to format excel errors returned from server's `yup` validation.
 *
 * Make sure to have fields translations in `excel.texts` file.
 *
 * **Translations should correspond to excel headers from server**.
 * @returns { string[] } formatted errors strings array.
 */
export const useFormatExcelErrors = () => {
    const { excelTexts, categories } = useI18n((i18n) => {
        return { excelTexts: i18n.excelTexts, categories: i18n.openSentencesBar };
    });

    const formatExcelErrors = useCallback(
        (errors: Array<string>) => {
            if (!errors || !Array.isArray(errors)) return [];

            const formats: Set<string> = new Set();

            errors.forEach((error: string) => {
                const match = error.match(/excelRows\[(\d+)\]\.(.+?) (.+)/);
                if (match) {
                    const rowNum = String(Number(match[1]) + 2);
                    let field = match[2];
                    const rule = match[3];
                    let message = '';
                    let allowedValues;
                    let categoriesList;
                    if (field === 'fullName' && rule.includes('required'))
                        // Means all name fields are empty. ask for first and last name only.
                        return;

                    switch (true) {
                        case rule.includes('required'):
                            message = excelTexts.missingField;
                            break;

                        case rule.includes('must be one'):
                            allowedValues = rule.split(':')[1];
                            message = `${excelTexts.oneOf} ${allowedValues}`;
                            break;

                        case rule.includes('invalid-gender'):
                            message = excelTexts.genderError;
                            break;

                        case rule.includes('class-grade-error'):
                            message = excelTexts.gradeError;
                            break;

                        case rule.includes('invalid-phone'):
                            message = excelTexts.invalidPhone;
                            break;

                        case rule.includes('invalid-text'):
                            message = excelTexts.invalidText;
                            break;
                        case rule.includes('invalid-pm-category'):
                            categoriesList = Object.keys(categories)
                                .filter((category) => category !== excludedPMCategoryKey)
                                .map((category) => categories[category as keyof typeof categories])
                                .join(', ');
                            message = `${excelTexts.invalidPm} ${categoriesList}`;
                            break;
                    }

                    if (excelTexts[field as keyof typeof excelTexts])
                        field = excelTexts[field as keyof typeof excelTexts] as string;
                    else field = '';

                    formats.add(
                        `${excelTexts.errorInRow} ${rowNum}${field ? `, ${excelTexts.column} ${field}:` : ':'} ${message}.`,
                    ); //${field}
                }
            });

            return Array.from(formats);
        },
        [excelTexts],
    );

    return formatExcelErrors;
};
