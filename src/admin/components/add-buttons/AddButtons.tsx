import React from 'react';

import { Button } from '@mui/material';

import excel from '/images/IconMicrosoftExcel.svg';
import whitePLus from '/images/whitePLus.svg';

import './addButtons.scss';
import { useI18n } from '../../../i18n/mainI18n';
import ExportReportBtn from '../../common/components/ExportReportBtn';

interface AddButtonsProps {
    addText: string;
    excelText?: string;
    addFunc: () => void;
    addExcelFunc?: () => void;
    showExcelButton?: boolean;
    exportReportOptions?: {
        url: string;
        fileName: string;
    };
}

/**
 * A stateless component that displays buttons for adding a student and opening an Excel file.
 * @component
 * @param {string} addText - The text to display on the "Add" button.
 * @param {string} excelText - The text to display on the "Excel" button.
 * @param {Function} addStudentFunc - A callback function to add a new student.
 * @param {Function} addExcelFunc - A callback function to add a new student with excel.
 * @returns {ReactNode} The rendered AddButtons component.
 */

const AddButtons: React.FC<AddButtonsProps> = ({
    addText,
    excelText,
    addFunc,
    addExcelFunc,
    showExcelButton = true,
    exportReportOptions,
}) => {
    const defaultExcelText = useI18n((i) => i.general.addByExcel);
    const excelTexts = useI18n((i) => i.excelTexts);
    return (
        <>
            <div className="add-buttons-container">
                {exportReportOptions && (
                    <ExportReportBtn
                        title={excelTexts.exportAdminTeachersReport}
                        queryPath={exportReportOptions.url}
                        contentQuery={{}}
                        disabledBtn={false}
                        filename="teachers-report"
                    />
                )}
                {showExcelButton ? (
                    <Button className="excel side-btn" variant="contained" onClick={addExcelFunc}>
                        <img src={excel} className="prev" alt="" />
                        {excelText || defaultExcelText}
                    </Button>
                ) : null}
                <Button
                    data-cy={'create-student-btn'}
                    className="add side-btn"
                    variant="contained"
                    onClick={addFunc}
                    color="secondary"
                >
                    <img src={whitePLus} className="add-icon" alt="" />
                    {addText}
                </Button>
            </div>
        </>
    );
};

export default AddButtons;
