import { FC, useEffect, useState } from 'react';
import { SchoolGrades } from '../../common/enums';
import { useGetStudentByGrades, useGetStudentsIdsOfStudyGroup } from '../../lib/react-query/hooks/useStudentGrade';
import { UserCard } from '../user-card/UserCard';
import { useI18n } from '../../i18n/mainI18n';
import { TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAddStudentsToStudyGroup } from '../../lib/react-query/hooks/useClasses';
import './selectStudentsByGrades.scss';
import { useImmer } from 'use-immer';

interface SelectStudentsByGrades {
    grades: SchoolGrades[];
    studyGroupId: number;
    handleClose: () => void;
}

/**
 * Represents the component for selecting students by grades.
 *
 * @component
 * @param {SchoolGrades[]} grades - The grades to filter the students by.
 * @param {number} studyGroupId - The ID of the study group.
 * @param {() => void} handleClose - The function to close the selection.
 * @returns {JSX.Element} - The SelectStudentsByGrades component.
 */

const SelectStudentsByGrades: FC<SelectStudentsByGrades> = ({ grades, studyGroupId, handleClose }) => {
    const [checkedStudentsIds, setCheckedStudentsIds] = useImmer<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { data: existingStudents } = useGetStudentsIdsOfStudyGroup(studyGroupId);
    const { data: studentsDetails } = useGetStudentByGrades(grades);
    const addStudentsToStudyGroup = useAddStudentsToStudyGroup();

    // makes sure that the students that already exists in this studyGroup will be marked checked when the user wants to add more students
    useEffect(() => {
        if (existingStudents) {
            const updatedCheckedStudentsIds = existingStudents.reduce(
                (obj, id) => {
                    obj[id] = true;
                    return obj;
                },
                {} as Record<string, boolean>,
            );

            setCheckedStudentsIds(updatedCheckedStudentsIds);
        }
    }, [existingStudents]);

    const i18n = useI18n((i18n) => {
        return {
            general: i18n.general,
            adminClassesTable: i18n.adminClassesTable,
        };
    });

    const handleCheckBoxChange = (studentId: number) => {
        setCheckedStudentsIds((draft) => {
            if (draft[studentId]) delete draft[studentId];
            else draft[studentId] = true;
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Filters student details based on a search query and returns an array of blocks with filtered students.
     * @param {Object} studentsDetails - An object containing student details where the keys represent letters and the values are arrays of students.
     * @param {string} searchQuery - The search query used to filter the students by their first or last name.
     * @returns {Array} - An array of objects representing blocks, where each block contains a letter as the key and an array of filtered students as the value.
     */
    const filteredStudentsBlocks = Object.keys(studentsDetails ?? {}).flatMap((letter) => {
        // Retrieves the array of students for the current letter.
        const students = studentsDetails?.[letter] ?? [];

        // Filters the students array based on the search query.
        const filteredStudents = students.filter(
            (student) =>
                student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        // Skips the block when the filtered students array is empty.
        if (filteredStudents.length === 0) {
            return [];
        }
        //Constructs the block object containing the letter and the filtered students array.
        return { letter, students: filteredStudents };
    });

    const handleAddStudentClick = () => {
        addStudentsToStudyGroup.mutate({ studentsIds: Object.keys(checkedStudentsIds).map(Number), studyGroupId });
        handleClose();
    };

    return (
        <div className="select-students-by-grades">
            <div className="content-area">
                <TextField
                    placeholder={i18n.general.searchByName}
                    className="search-bar"
                    variant="standard"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <div className="students custom-scroll-bar">
                    {filteredStudentsBlocks.length > 0 ? (
                        filteredStudentsBlocks.map((studentsBlock) => (
                            <div key={studentsBlock.letter} className="students-block">
                                <div className="students-block-letter">{studentsBlock.letter}</div>
                                {studentsBlock.students.map((student) => {
                                    return (
                                        <div className="user-card" key={student.id}>
                                            <UserCard
                                                key={student.id}
                                                cardType="user-class"
                                                classRoom={student.class}
                                                firstName={student.firstName}
                                                lastName={student.lastName}
                                                checkbox={true}
                                                onCheckBoxChange={() => handleCheckBoxChange(student.id)}
                                                isChecked={checkedStudentsIds[student.id]}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="no-students-found">{i18n.adminClassesTable.noStudentsFound}</div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleAddStudentClick}
                    className="add-students-button generic-popup-button"
                >
                    {i18n.general.add}
                    <KeyboardBackspaceIcon fontSize="large" />
                </button>
            </div>
        </div>
    );
};

export default SelectStudentsByGrades;
