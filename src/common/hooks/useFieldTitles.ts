import { useCallbackOnce } from '@hilma/tools';
import { useI18n } from '../../i18n/mainI18n';

export interface FieldsObject {
    [key: string]: boolean;
}

/**
 * Returns a formatted string of field titles based on the provided fields and language.
 * @param fields - The object containing fields and their boolean values.
 * @param lang - The language code representing the desired language.
 * @returns A formatted string of field titles.
 */
export function useFieldTitles() {
    const excelTexts = useI18n((i18n) => i18n.excelTexts);

    const formatExcelErrors = useCallbackOnce((fields: FieldsObject) => {
        const titles: string[] = [excelTexts.opening];
        for (const field in fields) {
            if (fields.hasOwnProperty(field)) {
                const title = fields[field] ? `${field} - ${excelTexts.optional}` : field;
                titles.push(`\u2022 ${title}`);
            }
        }
        return titles.join('\n');
    });

    return formatExcelErrors;
}
