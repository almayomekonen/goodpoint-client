import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import clsx from 'clsx';
import { useI18n } from '../i18n/mainI18n';

import { useUser } from '../common/contexts/UserContext';

import { Button } from '@mui/material';
import { Gender } from '../common/enums';
import { isDesktop } from '../common/functions/isDesktop';
import ErrorMessage from '../components/error-message/ErrorMessage';
import { HelmetTitlePage } from '../components/HelmetTitlePage';
import Loading from '../components/Loading';
import SearchBox from '../components/SearchBox';
import TitledHeader from '../components/titled-header/TitledHeader';
import { TopBar } from '../components/TopBar';
import { UserCard } from '../components/user-card/UserCard';
import './teachersList.scss';

interface TeacherInformation {
    firstName: string;
    lastName: string;
    id: string;
    gender: Gender;
}
/**
 * Component for displaying a list of teachers.
 * Allows users to search for teachers and select a teacher to send a good point.
 */
function TeachersList() {
    const i18n = useI18n((i18n) => ({
        general: i18n.general,
        search: i18n.searchTeachersAndStudents,
        message: i18n.general,
        pagesTitles: i18n.pagesTitles,
    }));
    const { user } = useUser();

    const navigate = useNavigate();
    window.scrollTo(0, 0);

    const [teacherSearch, setTeacherSearch] = useState<string>('');
    const [selected, setSelected] = useState<string>();

    const { status, data: teachersList } = useQuery(['teacher'], async () => {
        const { data } = await axios.get<TeacherInformation[]>(`/api/staff/get-teacher`);
        return data;
    });

    const filteredList = teachersList?.filter((item) => {
        const search = teacherSearch.trim();
        const fullName = item.firstName + ' ' + item.lastName;
        return fullName.match(new RegExp(search, 'i'));
    });

    return (
        <>
            <HelmetTitlePage title={i18n.pagesTitles.teachersList} />
            <div className={clsx('teacher-list', !isDesktop() && 'large-titled-page')}>
                {isDesktop() ? (
                    <>
                        <SearchBox
                            placeholder={i18n.search.search_teacher}
                            setSearch={setTeacherSearch}
                            search={teacherSearch}
                        />
                    </>
                ) : (
                    <TitledHeader size="large">
                        <TopBar />
                        <div className="title">{`${i18n.general.hello} ${user.firstName || i18n.general.user}`}</div>
                        <SearchBox
                            placeholder={i18n.search.search_teacher}
                            setSearch={setTeacherSearch}
                            search={teacherSearch}
                        />
                    </TitledHeader>
                )}

                {status === 'loading' ? (
                    <Loading />
                ) : status === 'error' ? (
                    <ErrorMessage errorMessage={i18n.message.errorMessage} />
                ) : (
                    <div className="list custom-scroll-bar">
                        {!filteredList?.length ? (
                            <div className="search_message">{i18n.search.no_results_teachers}</div>
                        ) : (
                            filteredList?.map((teacher: TeacherInformation) => (
                                <Button
                                    className={clsx(
                                        'row',
                                        isDesktop() && 'user-card-border',
                                        teacher.id == selected && 'selected',
                                    )}
                                    key={teacher.id}
                                    onClick={() => {
                                        navigate(isDesktop() ? `send-gp-chat-teachers` : `/send-gp-chat-teachers`, {
                                            state: {
                                                firstName: teacher.firstName,
                                                lastName: teacher.lastName,
                                                id: teacher.id,
                                                gender: teacher.gender,
                                            },
                                        }),
                                            setSelected(teacher.id);
                                    }}
                                >
                                    <UserCard
                                        cardType="user-name"
                                        firstName={teacher.firstName}
                                        lastName={teacher.lastName}
                                    />
                                </Button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
export default TeachersList;
