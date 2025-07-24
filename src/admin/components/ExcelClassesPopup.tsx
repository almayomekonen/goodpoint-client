import { FieldsObject, useFieldTitles } from '../../common/hooks/useFieldTitles';
import { useI18n } from '../../i18n/mainI18n';
import ExcelPopUp from '../common/components/ExcelPopUp';
import { adminQueryKeys } from '../common/consts/adminTableQueryKeys';
import { ExcelUploadResponse } from '../common/types/excelUploadResponse';

/**
a propless component that displays a popup for uploading a classes' data excel file.
It uses @hilma/forms for handling the form and @hilma/fileshandler-client for uploading the file.
It alsos handles the success message 
@returns a JSX Element with the popup UI and translation.
*/
const ExcelClassesPopup: React.FC = () => {
    //translation:
    const { excelTexts, adminClassesTable } = useI18n((i18n) => ({
        excelTexts: i18n.excelTexts,
        studentsExcel: i18n.studentsTable.excel,
        students: i18n.studentsTable.students,
        adminClassesTable: i18n.adminClassesTable,
    }));

    const getFieldTitles = useFieldTitles();

    const requiredInstructionFields: FieldsObject = {
        [adminClassesTable.excel.FieldsObject.gradeAndCLass]: false,
        [adminClassesTable.excel.FieldsObject.cLassNumber]: true,
        [adminClassesTable.excel.FieldsObject.fullName]: true,
    };

    const optionalFieldTitles: string = getFieldTitles(requiredInstructionFields);

    const successMessage = ({ newRecords, updated }: ExcelUploadResponse) => {
        let str = '';
        if (newRecords) str = `${excelTexts.adding} ${newRecords} ${adminClassesTable.classes}`;

        if (updated) {
            if (newRecords) str += ' ,';
            str += `${excelTexts.updated} ${updated} ${adminClassesTable.classes}`;
        }

        return str;
    };
    return (
        <>
            {/* the text is not updated to the classes popup i took it from the student one*/}
            <ExcelPopUp
                exampleFileUrl="classes_example.xlsx"
                uploadUrl="/api/classes/upload-classes-excel"
                generateSuccessMessage={successMessage}
                formatInstruction={
                    <div className="instruction-container">
                        <div>
                            <div className="instruction-title">{excelTexts.excelPointOut}</div>
                            <br />
                            <div>{adminClassesTable.excel.headersWarning}</div>
                            <br />
                            <div className="instruction-title">{optionalFieldTitles}</div>
                            <br />
                            <div>{excelTexts.gradeRange}</div>
                            <div>{excelTexts.classNumberRange}</div>
                        </div>
                    </div>
                }
                textInsideUpload={excelTexts.textInsideUpload}
                queryKey={adminQueryKeys.classesTable}
            />
        </>
    );
};

export default ExcelClassesPopup;
