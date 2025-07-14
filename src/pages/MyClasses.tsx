import axios from 'axios';
import cookies from 'js-cookie';
import './myClasses.scss';
//react
import { useEffect, useState } from 'react';
//components
import { GradesFilter } from '../components/GradesFilter';
import { HelmetTitlePage } from '../components/HelmetTitlePage';
import Loading from '../components/Loading';
import { TopBar } from '../components/TopBar';
import { ClassButton } from '../components/my-classes/ClassButton';
import { GroupsButton } from '../components/my-classes/GroupsButton';
import { MyClassSelectInput } from '../components/my-classes/MyClassSelectInput';
import { StudyGroupsHeadline } from '../components/my-classes/StudyGroupsHeadline';
import { StyledMyClassesHeadline } from '../components/my-classes/StyledTitle';
import BottomNavbar from '../components/navbar/BottomNavbar';
import TitledHeader from '../components/titled-header/TitledHeader';
//types/enums/const
import { DefaultGradeFilter } from '../common/consts/MyClasses.consts';
import { SchoolGrades, SourceNavbar } from '../common/enums';
import { ChosenGradeFilter, MyClassesData, StudyGroup } from '../common/types/MyClasses.types';
import { ClassList, StarredStudyGroup } from '../common/types/UserContext.type';
//context
import { UserInfoContextType, useUser } from '../common/contexts/UserContext';
import { useI18n } from '../i18n/mainI18n';
//functions
import clsx from 'clsx';
import { compareClassLists, compareStudyGroups } from '../common/functions/class-list';
import { insertAndSort } from '../common/functions/insertAndSort';
import { isDesktop } from '../common/functions/isDesktop';
import GenericPopup from '../components/generic-popup/GenericPopup';
import { useClassesList } from '../lib/react-query/hooks/useClassesList';
import image from '/images/no-classes.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { usePopup } from '../common/contexts/PopUpProvider';
import { popupType } from '../common/enums/popUpType.enum';
import ChangePasswordPopup from '../components/ChangePasswordPopup';

export const MyClasses = () => {
    const { errors, pagesTitles, general } = useI18n((i18n) => ({
        general: i18n.general,
        errors: i18n.errors,
        pagesTitles: i18n.pagesTitles,
    }));
    const { openPopup } = usePopup();
    const { user, setUser } = useUser();
    const [isBookMarkModalOpen, setIsBookMarkModalOpen] = useState(false);
    const [bookMarkType, setBookMarkType] = useState<'study-group' | 'class' | undefined>();
    const [bookMarkGrade, setBookMarkGrade] = useState<ClassList | StarredStudyGroup | null>(null);

    const { grade } = useParams<{ grade: ChosenGradeFilter }>();
    const [chosenGradeFilter, setChosenGradeFilter] = useState<ChosenGradeFilter>(grade || DefaultGradeFilter);

    const navigate = useNavigate();
    const isInDesktopMode = isDesktop();

    useEffect(() => {
        if (grade) setChosenGradeFilter(grade as ChosenGradeFilter);
    }, [grade]);

    useEffect(() => {
        const shouldChangePassword = !cookies.get('passChange');
        if (shouldChangePassword) {
            openPopup(popupType.REGULAR, {
                content: <ChangePasswordPopup />,
            });

            cookies.set('passChange', '1', { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90) });
        }
    }, []);

    const setGradeFilter = (grade: ChosenGradeFilter) => {
        setChosenGradeFilter(grade);
        navigate('/grade-classes/' + grade, { replace: true });
    };

    const { isLoading, data: allSchoolClasses } = useClassesList();

    function handleBookMark(type: 'class' | 'study-group', grade: ClassList | StarredStudyGroup) {
        if (!type || !grade) return;

        const prop = type === 'class' ? 'classes' : 'studyGroups';

        if (isStarred(grade.id, type)) {
            setUser((prev) => {
                const index = prev.starred[prop].findIndex((classObj) => classObj.id === grade.id);
                prev.starred[prop].splice(index, 1);
            });
            axios.post(`/api/staff/add-remove-${type}-from-user`, { classId: grade.id, action: 'remove' });
        } else {
            switch (type) {
                case 'class':
                    setUser((prev) => {
                        prev.starred.classes = insertAndSort(
                            prev.starred.classes,
                            compareClassLists,
                            grade as ClassList,
                        );
                    });
                    break;
                case 'study-group':
                    setUser((prev) => {
                        prev.starred.studyGroups = insertAndSort(
                            prev.starred.studyGroups,
                            compareStudyGroups,
                            grade as StarredStudyGroup,
                        );
                    });
                    break;
            }

            axios.post(`/api/staff/add-remove-${type}-from-user`, { classId: grade.id, action: 'add' });
        }
    }

    function isStarred(id: number, type: 'class' | 'study-group') {
        if (type === 'class') return user.starred.classes.some((userClass) => userClass.id === id);
        else return user.starred.studyGroups.some((userGroup) => userGroup.id === id);
    }

    function filterClassesList() {
        if (chosenGradeFilter !== DefaultGradeFilter) {
            return renderClassesAndGroups('filtered');
        } else if (!user.starred.classes.length && !user.starred.studyGroups.length)
            return (
                <div className="error-div">
                    <img className="image-no-classes" src={image} alt="" />
                    <p className="error-text">{errors.noClassesFound1}</p>
                </div>
            );

        return renderClassesAndGroups('myClasses');
    }

    function renderClassesAndGroups(type: 'myClasses' | 'filtered') {
        let dataToRenderFrom: MyClassesData | UserInfoContextType['starred'];
        let studyGroups: StarredStudyGroup[] | StudyGroup[] = [];

        if (type === 'filtered') {
            dataToRenderFrom = allSchoolClasses!;
            studyGroups = (dataToRenderFrom.studyGroups as StudyGroup[]).filter((sg) =>
                sg.grades.includes(chosenGradeFilter as SchoolGrades),
            );
        } else {
            dataToRenderFrom = user.starred;
            studyGroups = dataToRenderFrom.studyGroups;
        }

        return (
            <>
                <GenericPopup
                    open={isBookMarkModalOpen}
                    onAccept={() => {
                        handleBookMark(bookMarkType!, bookMarkGrade!);
                        setIsBookMarkModalOpen(false);
                    }}
                    onCancel={() => setIsBookMarkModalOpen(false)}
                    title={general.areYouSureYouWantToUnbookmark}
                    acceptText={general.yes}
                    cancelText={general.no}
                    containerClassName="unbookmark-popup"
                />

                <div className="classes-container">
                    {dataToRenderFrom?.classes.filterAndMap((data: ClassList) => {
                        if (type === 'myClasses' || data.grade === chosenGradeFilter) {
                            return (
                                <ClassButton
                                    handleBookMark={() => {
                                        setBookMarkType('class');
                                        setBookMarkGrade(data);
                                        if (isStarred(data.id, 'class')) setIsBookMarkModalOpen(true);
                                        else handleBookMark('class', data);
                                    }}
                                    classInUserClassesOrGroup={isStarred}
                                    grade={data}
                                    key={`c-${data.id}`}
                                />
                            );
                        }
                    })}
                </div>

                <StudyGroupsHeadline groupExists={!!studyGroups.length} type={type} />

                <div className="study-groups-container">
                    {studyGroups.map((data) => {
                        return (
                            <GroupsButton
                                isBookedMarked={type === 'myClasses' ? true : isStarred(data.id, 'study-group')}
                                handleBookMark={() => {
                                    setBookMarkType('study-group');
                                    setBookMarkGrade(data);

                                    if (isStarred(data.id, 'study-group')) setIsBookMarkModalOpen(true);
                                    else handleBookMark('study-group', data);
                                }}
                                group={data}
                                key={`g-${data.id}`}
                            />
                        );
                    })}
                </div>
            </>
        );
    }

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <HelmetTitlePage title={pagesTitles.myClasses} />
            <div className="classes-list-wrapper">
                {isInDesktopMode ? (
                    <MyClassSelectInput
                        setChosenGradeFilter={setGradeFilter}
                        chosenGradeFilter={chosenGradeFilter}
                        options={allSchoolClasses?.grades || []}
                        title=""
                    />
                ) : (
                    <div className="head">
                        <TitledHeader size="medium">
                            <TopBar />
                            <StyledMyClassesHeadline>
                                <div className="sticky">
                                    <GradesFilter
                                        onClick={setGradeFilter}
                                        gradeFilter={allSchoolClasses?.grades || []}
                                        chosenGradeFilter={chosenGradeFilter}
                                    />
                                </div>
                            </StyledMyClassesHeadline>
                        </TitledHeader>
                    </div>
                )}

                <div className={clsx('grades-wrapper', isInDesktopMode && 'grades-wrapper-desktop')}>
                    {filterClassesList()}
                </div>
            </div>

            {!isInDesktopMode && <BottomNavbar source={SourceNavbar.STUDENT} />}
        </>
    );
};
