import React from 'react';
import { useI18n } from '../../../i18n/mainI18n';
import { ExcelUploadResponse } from '../../common/types/excelUploadResponse';
import ExcelPopUp from '../../common/components/ExcelPopUp';
import { excludedPMCategoryKey } from '../../common/consts/excludedPMCategoryKey';
import { FieldsObject, useFieldTitles } from '../../../common/hooks/useFieldTitles';

/**
a propless component that displays a popup for uploading a students' data excel file.
It uses @hilma/forms for handling the form and @hilma/fileshandler-client for uploading the file.
@returns a JSX Element with the popup UI and translation.
*/

const ExcelPMPopUp: React.FC = () => {
    //translation:
    const { excelTexts, studentsExcel, presetMessagesBank, categories } = useI18n((i18n) => ({
        excelTexts: i18n.excelTexts,
        studentsExcel: i18n.studentsTable.excel,
        presetMessagesBank: i18n.presetMessagesBank,
        categories: i18n.openSentencesBar,
    }));

    const requiredInstructionFields: FieldsObject = {
        [presetMessagesBank.excelPopUp.FieldsObject.text]: false,
        [presetMessagesBank.excelPopUp.FieldsObject.gender]: false,
        [presetMessagesBank.excelPopUp.FieldsObject.category]: false,
    };

    const getFieldTitles = useFieldTitles();

    const optionalFieldTitles: string = getFieldTitles(requiredInstructionFields);

    const successMessage = ({ newRecords }: ExcelUploadResponse) => {
        let str = '';
        if (newRecords !== null && newRecords !== undefined && newRecords > 0) {
            if (newRecords) str = `${excelTexts.adding} ${newRecords} ${presetMessagesBank.excelPopUp.addExcelSuccess}`;
        } else if (Number(newRecords) === 0) {
            str = `${presetMessagesBank.excelPopUp.theyExist}`;
        } else {
            str = ` ${presetMessagesBank.excelPopUp.addExcelSuccess} ${excelTexts.adding}`;
        }
        return str;
    };

    return (
        <>
            <ExcelPopUp
                uploadUrl="/api/preset-messages/upload-pm-excel"
                generateSuccessMessage={successMessage}
                formatInstruction={
                    <div className="instruction-container">
                        <div>
                            <div className="instruction-title">{excelTexts.excelPointOut}</div>
                            <br />
                            <ul>
                                <li>{studentsExcel.headersWarning}</li>
                            </ul>
                            <br />
                            <div className="instruction-title">{optionalFieldTitles}</div>
                            <br />
                            <ul>
                                <li>
                                    {presetMessagesBank.excelPopUp.fieldsInsideCategory +
                                        ' ' +
                                        Object.keys(categories)
                                            .filter((category) => category !== excludedPMCategoryKey)
                                            .map((category) => categories[category as keyof typeof categories])
                                            .join(', ') +
                                        '.'}
                                </li>
                            </ul>
                        </div>
                    </div>
                }
                textInsideUpload={excelTexts.textInsideUpload}
                queryKey={'PMTable'}
            />
        </>
    );
};

export default ExcelPMPopUp;
