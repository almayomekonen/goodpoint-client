//in this function i'm assuming that the father wrapped in form provider
import { Updater } from 'use-immer';
import { useI18n } from '../../i18n/mainI18n';
//form
import { FormSubmitButton, FormTextInput } from '@hilma/forms';
import { useField } from 'formik';
//components
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import { StudentRow } from './StudentRow';
//scss
import './selectStudentsPopup.scss';
import { StudentsByClass } from '../../common/types/studentsByClass.type';
import { FC } from 'react';

interface SelectStudentsPopupProps {
    open: boolean;
    setOpen: (val: boolean) => void;
    studentNames: StudentsByClass[] | undefined;
    chosenStudents: Record<string, string>;
    setChosenStudents: Updater<Record<string, string>>;
}

/**
 * Function: SelectStudentsPopup
 * -----------------------------
 * This component displays a popup dialog for selecting students from a list. Users can search for students by name and select/deselect them using checkboxes.
 * The selected students are added to the chosenStudents state. The component is used within the ExportReport component to allow the selection of specific
 * students for generating a report.
 *
 * @param {SelectStudentsPopupProps} props - The props object containing necessary data for rendering the component.
 * @returns {JSX.Element} The SelectStudentsPopup component JSX element.
 */
export const SelectStudentsPopup: FC<SelectStudentsPopupProps> = ({
    open,
    setOpen,
    studentNames,
    setChosenStudents,
    chosenStudents,
}) => {
    const reportText = useI18n((i18n) => i18n.reportText);
    const [field] = useField('who');

    function changeIfInStudentArr(id: string) {
        return Boolean(chosenStudents[id as keyof typeof chosenStudents]);
    }
    function renderFilteredStudents() {
        if (!studentNames) return;
        return (
            <div className="scroll">
                {studentNames.filterAndMap((val) => {
                    if (!field.value || `${val.firstName} ${val.lastName}`.includes(field.value))
                        return (
                            <StudentRow
                                chosen={changeIfInStudentArr(val.id.toString())}
                                setChosenStudents={setChosenStudents}
                                student={val}
                                key={val.id}
                            />
                        );
                })}
            </div>
        );
    }
    return (
        <div className="popup-main-wrapper">
            <Dialog
                className="popup-wrapper"
                onClose={() => setOpen(false)}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
            >
                <FormTextInput
                    name={field.name}
                    endAdornment={<SearchIcon />}
                    containerClassName="input"
                    placeholder={reportText.placeHolders.searchByName}
                />
                <div className="background-wrapper">
                    {renderFilteredStudents()}
                    <div className="popup-button-wrapper">
                        <FormSubmitButton
                            onClick={() => {
                                setOpen(false);
                            }}
                            className="button"
                        >
                            {reportText.labels.add}
                        </FormSubmitButton>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};
