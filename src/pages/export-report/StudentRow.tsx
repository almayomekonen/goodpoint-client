import { Checkbox } from '@mui/material';
import { FC } from 'react';
import { Updater } from 'use-immer';
import { StudentsByClass } from '../../common/types/studentsByClass.type';

interface StudentRowProps {
    student: StudentsByClass;
    setChosenStudents: Updater<{ [key: string]: string }>;
    chosen: boolean;
}

/**
 * Function: StudentRow
 * --------------------
 * This component represents a row in the student list. It displays a checkbox and the student's name. Users can click on the row to select/deselect the student.
 * When a student is selected, their ID and full name are added to the chosenStudents state. The component is used within the SelectStudentsPopup component
 * to render individual student rows.
 *
 * @param {StudentRowProps} props - The props object containing necessary data for rendering the component.
 * @returns {JSX.Element} The StudentRow component JSX element.
 */
export const StudentRow: FC<StudentRowProps> = ({ student, setChosenStudents, chosen }) => {
    function handleClick() {
        setChosenStudents((prev) => {
            chosen ? delete prev[student.id] : (prev[student.id] = `${student.firstName} ${student.lastName}`);
        });
    }
    return (
        <div className="checkbox-line" onClick={handleClick}>
            <Checkbox checked={chosen} className="checkbox" />
            <span className="checkbox-label">{`${student.firstName} ${student.lastName}`}</span>
        </div>
    );
};
