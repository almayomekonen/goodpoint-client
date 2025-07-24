import React from 'react';

import { useI18n } from '../../../../i18n/mainI18n';

import { FieldsObject, useFieldTitles } from '../../../../common/hooks/useFieldTitles';
import ExcelPopUp from '../../../common/components/ExcelPopUp';
import { ExcelUploadResponse } from '../../../common/types/excelUploadResponse';

/**
a propless component that displays a popup for uploading a students' data excel file.
It uses @hilma/forms for handling the form and @hilma/fileshandler-client for uploading the file.
@returns a JSX Element with the popup UI and translation.
*/

const ExcelStudentsPopUp: React.FC = () => {
    //translation:
    const { excelTexts, studentsExcel, students } = useI18n((i18n) => ({
        excelTexts: i18n.excelTexts,
        studentsExcel: i18n.studentsTable.excel,
        students: i18n.studentsTable.students,
    }));

    const getFieldTitles = useFieldTitles();

    const requiredInstructionFields: FieldsObject = {
        [studentsExcel.FieldsObject.fullName]: false,
        [studentsExcel.FieldsObject.gradeAndCLass]: false,
        [studentsExcel.FieldsObject.gender]: false,
        [studentsExcel.FieldsObject.p1]: true,
        [studentsExcel.FieldsObject.p2]: true,
        [studentsExcel.FieldsObject.studentPhone]: true,
    };

    const optionalFieldTitles: string = getFieldTitles(requiredInstructionFields);

    const successMessage = ({ newRecords, updated }: ExcelUploadResponse) => {
        let str = '';
        if (newRecords) str = `${excelTexts.adding} ${newRecords} ${students}`;

        if (updated) {
            if (newRecords) str += ' ,';
            str += `${excelTexts.updated} ${updated} ${students}`;
        }

        return str;
    };

    return (
        <>
            <ExcelPopUp
                exampleFileUrl="students_example.xlsx"
                uploadUrl="/api/student/upload-Students-excel"
                generateSuccessMessage={successMessage}
                formatInstruction={
                    <div className="instruction-container">
                        <div>
                            <div className="instruction-title">{excelTexts.excelPointOut}</div>
                            <ul>
                                <li>{excelTexts.gradeRange}</li>
                                <li>{excelTexts.classNumberRange}</li>
                                <li>{studentsExcel.headersWarning}</li>
                            </ul>
                            <div className="instruction-title">{optionalFieldTitles}</div>
                        </div>
                    </div>
                }
                textInsideUpload={excelTexts.textInsideUpload}
                queryKey={'studentsTable'}
            />
        </>
    );
};

export default ExcelStudentsPopUp;
