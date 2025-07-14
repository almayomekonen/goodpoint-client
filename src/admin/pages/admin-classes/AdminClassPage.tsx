import { useTableQuery } from '@hilma/forms';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import clsx from 'clsx';
import { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import SelectStudentsByGrades from '../../../components/select-students-by-grades-content/SelectStudentsByGrades';
import { useI18n } from '../../../i18n/mainI18n';
import { useGetClassDetails, useGetStudyGroupDetails } from '../../../lib/react-query/hooks/useClasses';
import ExportReportBtn from '../../common/components/ExportReportBtn';
import { StudentRow } from '../../common/types/table-type/row-interfaces';
import AddClassPopupContent from '../../components/add-class-popup-content/AddClassPopupContent';
import CustomAdminTableTitle from '../../components/admin-table-title/CustomAdminTableTitle';
import AdminClassesStudents from './AdminClassesStudentsTable';
import './adminClassPage.scss';

/**
 * AdminClassPage Component
 *
 * This component renders the admin page for a specific class or study group.
 *
 * @param {string} classType - The type of the class ('class' or 'studyGroup').
 */
interface AdminClassPageProps {
    classType: 'class' | 'studyGroup';
}

const AdminClassPage: FC<AdminClassPageProps> = ({ classType }) => {
    const { id } = useParams();
    const { data: studentTableData } = useTableQuery<{ count: number; results: { students: StudentRow[] } }>(
        `studentsTable${id}`,
    );
    const { openPopup, closePopup } = usePopup();
    const location = useLocation();

    // Fetch class or study group details
    const { data: classDetails } = classType === 'class' ? useGetClassDetails(Number(id)) : { data: null };
    const { data: studyGroupDetails } =
        classType === 'studyGroup' ? useGetStudyGroupDetails(Number(id)) : { data: null };

    // Get the required translation strings
    const i18n = useI18n((i18n) => {
        return {
            general: i18n.general,
            adminClassesTable: i18n.adminClassesTable,
            schoolGrades: i18n.schoolGrades,
            adminTopBar: i18n.adminTopBar,
            addStudents: i18n.studentsTable.addStudents,
        };
    });

    // Generate the titles based on class or study group details
    const titles = (() => {
        const titles = { title: '', secondaryTitle: '' };
        if (classType === 'class' && classDetails) {
            titles.title = `${i18n.general.class} ${i18n.schoolGrades.gradesList[classDetails.grade]} ${classDetails.classIndex}`;
        } else if (classType === 'studyGroup' && studyGroupDetails) {
            const { name, grades } = studyGroupDetails;

            if (grades && grades.length === 1) {
                titles.title = name;
                titles.secondaryTitle = `${i18n.schoolGrades.grade} ${i18n.schoolGrades.gradesList[grades[0]]}`;
            } else if (grades && grades.length > 1) {
                titles.title = name;
                titles.secondaryTitle = `${i18n.schoolGrades.grades} ${grades.map((grade) => i18n.schoolGrades.gradesList[grade]).join(', ')}`;
            }
        }
        return titles;
    })();

    // Check if the page is currently on the students tab
    const isInStudentsTable = () => {
        const pathParts = location.pathname.split('/');
        return pathParts[pathParts.length - 1] === 'students';
    };

    // Event handler for the edit class button click
    const handleEditClassClick = () => {
        if (classType === 'class') {
            openPopup(popupType.REGULAR, {
                title: i18n.adminClassesTable.editClassDetails,
                content: (
                    <AddClassPopupContent
                        handleClose={closePopup}
                        editContent={classDetails || undefined}
                        classType="class"
                    />
                ),
            });
        } else {
            openPopup(popupType.REGULAR, {
                title: i18n.adminClassesTable.editClassDetails,
                content: (
                    <AddClassPopupContent
                        handleClose={closePopup}
                        editContent={studyGroupDetails || undefined}
                        classType="studyGroup"
                    />
                ),
            });
        }
    };

    // Event handler for the add students button click
    const handleAddStudentsClick = () => {
        openPopup(popupType.REGULAR, {
            title: i18n.adminClassesTable.editStudentsList,
            content: (
                <SelectStudentsByGrades
                    handleClose={closePopup}
                    studyGroupId={Number(id)}
                    grades={studyGroupDetails?.grades ?? []}
                />
            ),
        });
    };

    return (
        <div className="admin-table-container">
            <div className="admin-class-container">
                <CustomAdminTableTitle
                    title={titles.title}
                    secondaryTitle={titles.secondaryTitle}
                    sideButtons={
                        isInStudentsTable() ? (
                            <div className="buttons">
                                <Button
                                    type="button"
                                    className={clsx('edit-button', 'button')}
                                    onClick={handleEditClassClick}
                                    variant="contained"
                                >
                                    {i18n.adminClassesTable.editClassDetails}
                                    <EditIcon />
                                </Button>

                                <ExportReportBtn
                                    queryPath="/api/classes/create-class-report-xlsx"
                                    filename={`${i18n.general.report}  ${titles.title}`}
                                    disabledBtn={studentTableData?.count === 0}
                                    title={i18n.adminClassesTable.exportClassReport}
                                    contentQuery={{ classId: Number(id) }}
                                />

                                {/* only relevant for study group */}
                                {classType === 'studyGroup' && (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="secondary"
                                        className={clsx('add-students-button', 'button')}
                                        onClick={handleAddStudentsClick}
                                    >
                                        <AddIcon fontSize="large" />
                                        {i18n.adminClassesTable.editStudentsList}
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <></>
                        )
                    }
                />

                <AdminClassesStudents classType="class" />
            </div>
        </div>
    );
};

export default AdminClassPage;
