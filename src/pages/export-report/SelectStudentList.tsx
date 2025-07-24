import React, { useRef, useState } from 'react';

import { Box, TextField, Typography } from '@mui/material';
import { isDesktop } from '../../common/functions/isDesktop';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
import { Scrollable } from '../../components/scrollable/Scrollable';
import { useI18n } from '../../i18n/mainI18n';

import { Updater } from 'use-immer';
import { ClassList } from '../../common/types/UserContext.type';
import { StudentsByClass } from '../../common/types/studentsByClass.type';
import { OvalWithX } from '../../components/OvalWithX';
import { UserCard } from '../../components/user-card/UserCard';
import './selectStudentList.scss';

interface SelectStudentListProps {
    close: () => void;
    studentsList: StudentsByClass[];
    chosenStudents: Record<string, string>;
    setChosenStudents: Updater<Record<string, string>>;
    grade: ClassList | undefined;
}

/**
 * Component: SelectStudentList
 * ---------------------------
 * This component displays a list of students with checkboxes for selecting recipients of a report. Users can filter the list by entering a search term and
 * select/deselect students by clicking on their checkboxes. It also provides an option to remove selected students from the list. The component is used
 * within the ExportReport component to allow the selection of specific students for generating a report.
 *
 * @param {SelectStudentListProps} props - The props object containing necessary data for rendering the component.
 * @returns {JSX.Element} The SelectStudentList component JSX element.
 */
export const SelectStudentList: React.FC<SelectStudentListProps> = ({
    grade,
    close,
    studentsList,
    setChosenStudents,
    chosenStudents,
}) => {
    const [filterName, setFilterName] = useState('');

    const isInDesktop = isDesktop();
    const i18n = useI18n((i) => {
        return {
            generalTexts: i.general,
            sendingGpListTexts: i.sendingGoodPointList,
            pagesTitles: i.pagesTitles,
            grades: i.schoolGrades.gradesList,
        };
    });

    const containerRef = useRef<HTMLDivElement>(null);

    /**
     * Handles the click event when a student is selected or deselected. Updates the chosen students state based on the clicked student's ID.
     *
     * @param {StudentsByClass} student - The student object that was clicked.
     */
    function handleClick(student: StudentsByClass) {
        setChosenStudents((prev) => {
            !!chosenStudents[student.id]
                ? delete prev[student.id]
                : (prev[student.id.toString()] = `${student.firstName} ${student.lastName}`);
        });
    }

    /**
     * Handles the change event when the search input value is changed. Updates the filter name state based on the entered search term.
     */
    function handleSearch(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFilterName(e.target.value.trimStart());
    }

    return (
        <Box className="Select-student-list-list-container">
            <HelmetTitlePage title={i18n.pagesTitles.sendingGoodPointList} />

            <Box className="Select-student-list-list-users-container">
                <Box className="send-gp-search-header">
                    <Typography className="Select-student-list-list-users-container-header">
                        {i18n.sendingGpListTexts.chooseGroupMessageReceivers}
                    </Typography>

                    {/**search bar  */}
                    <TextField
                        className="search"
                        value={filterName}
                        onChange={(e) => handleSearch(e)}
                        variant="standard"
                        InputProps={{
                            sx: {
                                '& input': {
                                    textAlign: 'center',
                                    fontSize: '1.6rem',
                                    color: '#5E6C94',
                                },
                            },
                        }}
                        placeholder={i18n.sendingGpListTexts.nameOfTeacherOrStudent}
                    />
                </Box>

                {/**list of users that were selected for the report */}
            </Box>
            <div className="oval-wrapper">
                {Object.keys(chosenStudents).map((key) => (
                    <OvalWithX
                        key={key}
                        text={chosenStudents[key]}
                        onClick={() =>
                            setChosenStudents((prev) => {
                                delete prev[key];
                            })
                        }
                    />
                ))}
            </div>

            {/**button on the bottom left to exit popup */}
            <button
                style={{
                    bottom: '2%',
                    position: isInDesktop ? 'absolute' : 'fixed',
                }}
                onClick={close}
                className="Select-student-list-button"
            >
                <Typography className="Select-student-list-text">{i18n.generalTexts.continue}</Typography>
                <img src="/images/arrow-left.svg" className="Select-student-list-icon" />
            </button>

            {/**list of students to export report to */}
            <Scrollable dir="topToBottom" containerRef={containerRef}>
                <div id="scrollableDiv" ref={containerRef}>
                    <div className="scroll">
                        {studentsList.filterAndMap((val) => {
                            if (
                                (!filterName || `${val.firstName} ${val.lastName}`.includes(filterName.trim())) &&
                                grade
                            ) {
                                return (
                                    <div className="flex-center user-card-border" key={val.id}>
                                        <UserCard
                                            isChecked={!!chosenStudents[val.id]}
                                            checkbox
                                            onCheckBoxChange={() => {
                                                handleClick(val);
                                            }}
                                            cardType="user-class-gpCount"
                                            firstName={val.firstName}
                                            lastName={val.lastName}
                                            classRoom={{ grade: grade.grade, classIndex: grade.classIndex }}
                                            gpCount={val.gpCount}
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </Scrollable>
        </Box>
    );
};
