import { FC, useState } from 'react';
import { useTableQuery } from '@hilma/forms';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../../i18n/mainI18n';
import { useGetStudyGroupDetails } from '../../../lib/react-query/hooks/useClasses';
import GenericPopup from '../../../components/generic-popup/GenericPopup';
import SelectStudentsByGrades from '../../../components/select-students-by-grades-content/SelectStudentsByGrades';
import { StudentRow } from '../../common/types/table-type/row-interfaces';
import StudentTablePage from '../student/StudentsTablePage';
import './adminClassPage.scss';

/**
 * AdminClassesStudentsTable Component
 *
 * This component renders a table of students for an admin class or study group.
 *
 * @param {string} classType - The type of the class ('class' or 'studyGroup').
 */
interface AdminClassesStudentsTableProps {
    classType: 'class' | 'studyGroup';
}

const AdminClassesStudentsTable: FC<AdminClassesStudentsTableProps> = ({ classType }) => {
    // State for managing the visibility of the add students popup
    const [openAddStudentsPopup, setOpenAddStudentsPopup] = useState(false);

    // Get the id from the URL parameters
    const { id } = useParams();

    // Query the student table data using the id
    const { data: studentTableData } = useTableQuery<StudentRow, true>(`studentsTable${id}`);

    // Query the study group details if the classType is 'studyGroup'
    const { data: studyGroupDetails } =
        classType === 'studyGroup' ? useGetStudyGroupDetails(Number(id)) : { data: null };

    const i18n = useI18n((i18n) => {
        return {
            general: i18n.general,
            adminClassesTable: i18n.adminClassesTable,
            schoolGrades: i18n.schoolGrades,
            adminTopBar: i18n.adminTopBar,
            addStudents: i18n.studentsTable.addStudents,
        };
    });

    // Event handler for the add students button click
    const handleAddStudentsClick = () => {
        setOpenAddStudentsPopup(true);
    };

    const isEmptyStudyGroup = studentTableData?.count === 0 && classType === 'studyGroup';

    return (
        <>
            {/* Render add students button if it's an empty study group */}
            {isEmptyStudyGroup && (
                <div className="empty-studyGroup-students-table">
                    <Button
                        onClick={handleAddStudentsClick}
                        className="button add-students-middle-button"
                        variant="contained"
                    >
                        <AddIcon style={{ fontSize: '3rem' }} />
                        {i18n.addStudents}
                    </Button>
                </div>
            )}

            {/* Render student table page if it's a class or not an empty study group */}
            <div style={{ display: isEmptyStudyGroup ? 'none' : 'block' }}>
                <StudentTablePage
                    classDetails={{
                        id: Number(id),
                        classType: classType,
                    }}
                />
            </div>

            {/* Render add students popup */}
            <GenericPopup
                open={openAddStudentsPopup}
                title={i18n.adminClassesTable.chooseStudentsToAddToClass}
                onCancel={() => setOpenAddStudentsPopup(false)}
                containerClassName="add-students-popup"
                clearIcon
                isForm
            >
                <SelectStudentsByGrades
                    handleClose={() => setOpenAddStudentsPopup(false)}
                    studyGroupId={Number(id)}
                    grades={studyGroupDetails?.grades ?? []}
                />
            </GenericPopup>
        </>
    );
};

export default AdminClassesStudentsTable;
