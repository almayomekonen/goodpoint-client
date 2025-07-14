//react
import { Fragment, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

//libraries
import axios from 'axios';
import clsx from 'clsx';
import { useI18n } from '../../i18n/mainI18n';

import { useQueryName } from '../../common/contexts/StudentListQueryContext';
//components
import { Button } from '@mui/material';
import ErrorMessage from '../error-message/ErrorMessage';
import { InnerTopBar } from './InnerTopBar';
import Loading from '../Loading';
import SearchBox from '../SearchBox';
import TitledHeader from '../titled-header/TitledHeader';
import { UserCard } from '../user-card/UserCard';

import { isDesktop } from '../../common/functions/isDesktop';

//scss
import './studentList.scss';
import { SchoolGrades } from '../../common/enums';
export interface StudentInformation {
    firstName: string;
    lastName: string;
    id: number;
    gender: string;
    gpCount: number;
    class: { grade: SchoolGrades };
}

interface StudentListProps {
    path: string;
    studyGroupName?: string;
    classIndex?: `${number}`;
    grade?: SchoolGrades;
}

/**
 * Represents the component for displaying a list of students either in a class or in study group.
 *
 * @component
 * @param {string} path - The path for fetching the student list.
 * @param {string} [studyGroupName] - The name of the study group.
 * @param {string} [classIndex] - The class index.
 * @param {SchoolGrades} [grade] - The grade.
 * @returns {JSX.Element} - The StudentsList component.
 */
function StudentsList({ path, studyGroupName, classIndex, grade }: StudentListProps) {
    const navigate = useNavigate();
    const i18n = useI18n((i18n) => ({
        search: i18n.searchTeachersAndStudents,
        alphabet: i18n.schoolGrades,
        message: i18n.general,
    }));
    const [studentSearch, setStudentSearch] = useState<string>('');
    const [selected, setSelected] = useState<number>();
    const isInDesktop = isDesktop();
    const { studentsQueryName } = useQueryName();

    const gradeString = i18n.alphabet.gradesList[grade!];

    const { status, data: students } = useQuery(
        ['update-students', studentsQueryName],
        async () => {
            const { data } = await axios.get<StudentInformation[]>(path);
            return data;
        },
        { refetchOnMount: false },
    );

    let countGp = 0;
    students?.forEach((student) => (countGp += student.gpCount));

    const filteredList = students
        ?.filter((item) => (item.firstName + ' ' + item.lastName).includes(studentSearch.trim()))
        .sort((a, b) => a.gpCount - b.gpCount);

    return (
        <Fragment>
            <div className={clsx('studentsList', !isInDesktop && 'medium-titled-page')}>
                {isInDesktop ? (
                    <>
                        <SearchBox
                            placeholder={i18n.search.search_student}
                            setSearch={setStudentSearch}
                            search={studentSearch}
                        />
                        <div className="header-class-desktop">
                            <InnerTopBar
                                studyGroupName={studyGroupName}
                                classIndex={classIndex}
                                countGp={countGp}
                                gradeString={gradeString}
                            />
                        </div>
                    </>
                ) : (
                    <TitledHeader size="medium">
                        <div className="top-bar">
                            <InnerTopBar
                                studyGroupName={studyGroupName}
                                classIndex={classIndex}
                                countGp={countGp}
                                gradeString={gradeString}
                            />
                            <SearchBox
                                placeholder={i18n.search.search_student}
                                setSearch={setStudentSearch}
                                search={studentSearch}
                            />
                        </div>
                    </TitledHeader>
                )}

                {status === 'loading' ? (
                    <Loading />
                ) : status === 'error' ? (
                    <ErrorMessage errorMessage={i18n.message.errorMessage} />
                ) : (
                    <div className="list custom-scroll-bar">
                        {filteredList?.length === 0 ? (
                            <div className="search_message">{i18n.search.no_results_students}</div>
                        ) : (
                            filteredList?.map((student: StudentInformation) => (
                                <Button
                                    className={clsx(
                                        'row',
                                        isInDesktop && 'user-card-border',
                                        student.id == selected && 'selected',
                                    )}
                                    key={student.id}
                                    onClick={() => {
                                        navigate(isInDesktop ? `send-gp-chat` : `/send-gp-chat`, {
                                            state: {
                                                firstName: student.firstName,
                                                lastName: student.lastName,
                                                gpCount: student.gpCount,
                                                id: student.id,
                                                gender: student.gender,
                                                class: student.class,
                                            },
                                            replace: isInDesktop,
                                        });
                                        setSelected(student.id);
                                    }}
                                >
                                    <UserCard
                                        cardType="user-gpCount"
                                        grade={student.class?.grade}
                                        firstName={student.firstName}
                                        lastName={student.lastName}
                                        gpCount={student.gpCount}
                                    />
                                </Button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
}
export default StudentsList;
