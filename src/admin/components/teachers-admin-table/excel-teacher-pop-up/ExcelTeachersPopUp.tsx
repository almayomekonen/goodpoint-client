import React from 'react';

import { useI18n } from '../../../../i18n/mainI18n';

import { FieldsObject, useFieldTitles } from '../../../../common/hooks/useFieldTitles';
import ExcelPopUp from '../../../common/components/ExcelPopUp';
import { ExcelUploadResponse } from '../../../common/types/excelUploadResponse';

/**
a propless component that displays a popup for uploading a students' data excel file.
It uses @hilma/forms for handling the form and @hilma/fileshandler-client for uploading the file.
It alsos handles the success message 
@returns a JSX Element with the popup UI and translation.
*/

const ExcelTeachersPopUp: React.FC = () => {
    //translation:
    const { excelTexts, studentsExcel, teachersTable } = useI18n((i18n) => ({
        excelTexts: i18n.excelTexts,
        studentsExcel: i18n.studentsTable.excel,
        teachersTable: i18n.teachersTable,
    }));

    const requiredInstructionFields: FieldsObject = {
        [teachersTable.excel.FieldsObject.fullName]: false,
        [teachersTable.excel.FieldsObject.gradeAndCLass]: false,
        [teachersTable.excel.FieldsObject.username]: true,
        [teachersTable.excel.FieldsObject.gender]: false,
    };

    const getFieldTitles = useFieldTitles();

    const optionalFieldTitles: string = getFieldTitles(requiredInstructionFields);

    const successMessage = ({ newRecords, updated }: ExcelUploadResponse) => {
        let str = '';
        if (newRecords !== null && newRecords !== undefined && updated) {
            if (newRecords) str = `${excelTexts.adding} ${newRecords} ${teachersTable.teachers}`;

            if (updated) {
                if (newRecords) str += ' ,';
                str += `${excelTexts.updated} ${updated} ${teachersTable.teachers}`;
            }
        } else {
            str = ` ${teachersTable.teachers} ${excelTexts.adding}`;
        }
        return str;
    };

    return (
        <>
            <ExcelPopUp
                exampleFileUrl="teacher_file_example.xlsx"
                uploadUrl="/api/staff/upload-teacher-excel"
                generateSuccessMessage={successMessage}
                formatInstruction={
                    <div className="instruction-container">
                        <div>
                            <div className="instruction-title">{excelTexts.excelPointOut}</div>
                            <br />
                            <ul>
                                <li>{excelTexts.gradeRange}</li>
                                <li>{excelTexts.classNumberRange}</li>
                            </ul>
                            <br />
                            <div className="instruction-title">{optionalFieldTitles}</div>
                            <br />
                            <ul>
                                <li>{studentsExcel.headersWarning}</li>
                            </ul>
                        </div>
                    </div>
                }
                textInsideUpload={excelTexts.textInsideUpload}
                queryKey={'teachersTable'}
            />
        </>
    );
};

export default ExcelTeachersPopUp;
