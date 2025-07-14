import { AdminTable, GenericColumn, useAlert } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertWithUndo from '../../../admin/common/components/AlertWithUndo';
import { SchoolRow } from '../../../admin/common/types/table-type/row-interfaces/schoolRow.interface';
import AddButtons from '../../../admin/components/add-buttons/AddButtons';
import { LeftArrowIcon } from '../../../../public/images/LeftArrowIcon';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import GenericPopup from '../../../components/generic-popup/GenericPopup';
import { useI18n } from '../../../i18n/mainI18n';
import { useAddSchool, useDeleteSchool, useEditSchool } from '../../../lib/react-query/hooks/useSuperAdminSchools';
import SuperAdminAddSchoolForm from './SuperAdminAddSchoolForm';
import { adminQueryKeys } from '../../../admin/common/consts/adminTableQueryKeys';

export type SchoolForm = {
    name: string;
    code: string;
    id: number;
};

/** This component is the main component for the super admin schools page , it contains the table of all the schools in the system , and allows  the super admin to add , edit and delete schools
 *
 *
 */
export const SuperAdminSchools = () => {
    //mutations for schools table
    const { mutate: addSchool } = useAddSchool();
    const { mutate: editSchool } = useEditSchool();
    const { mutate: deleteSchool } = useDeleteSchool();
    const { openPopup } = usePopup();
    const navigate = useNavigate();
    const showAlert = useAlert();

    //translations
    const i18n = useI18n((i) => {
        return {
            general: i.general,
            superAdmin: i.superAdmin,
            actions: i.superAdmin.actions,
        };
    });

    const [isAddSchoolPopupOpen, setIsAddSchoolPopupOpen] = useState(false);
    const [isEditSchoolPopupOpen, setIsEditSchoolPopupOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState({
        name: '',
        code: '',
        id: 0,
    });

    //columns for the table
    const columns: GenericColumn<SchoolRow>[] = [
        {
            key: 'name',
            label: i18n.superAdmin.nameOfSchool,
        },
        {
            key: 'code',
            label: i18n.superAdmin.codeOfSchool,
        },
        {
            key: 'numOfStudents',
            label: i18n.superAdmin.numOfStudents,
        },
        {
            type: 'icon',
            key: 'id',
            renderColumn(row) {
                // only superAdmin can edit system pm

                return (
                    <div className="super-admin-schools-action-buttons">
                        <button
                            type="button"
                            onClick={() => handleEditSchoolClick(row.id, row)}
                            className="edit-button"
                        >
                            <EditIcon />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDeleteSchoolClick(row.id, row)}
                            className="delete-button clean-no-style-button"
                        >
                            <DeleteIcon />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSchoolInfoClick(row)}
                            className="clean-no-style-button school-info-button"
                        >
                            <LeftArrowIcon />
                        </button>
                    </div>
                );
            },
        },
    ];

    function showSchoolMutationError(error: any) {
        //meaning the school code already exist, custom status from server
        if (error.status === 409) {
            showAlert(i18n.superAdmin.aSchoolWithThatCodeAlreadyExist, 'error');
        }
    }

    function handleAddSchoolSubmit(school: { name: string; code: string }) {
        //uploading school to server
        setIsAddSchoolPopupOpen(false);
        addSchool(school, {
            onError: showSchoolMutationError,
        });
    }

    function handleEditSchoolClick(id: number, schoolData: SchoolRow) {
        //Stringify the code because the input is a string , fixes a bug where there is a mismatch between the value from the server and the type of the input
        setSelectedSchool({ ...schoolData, code: String(schoolData.code) });
        setIsEditSchoolPopupOpen(true);
    }

    function handleEditSchoolSubmit(school: SchoolForm) {
        setIsEditSchoolPopupOpen(false);
        editSchool(school, {
            onError: showSchoolMutationError,
        });
    }

    function handleDeleteSchoolClick(id: number, schoolData: SchoolRow) {
        setSelectedSchool({ ...schoolData, code: String(schoolData.code) });
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.superAdmin.areYouSureYouWantToDeleteSchool,
            content: i18n.superAdmin.theSchoolWillBeDelete,
            checkboxText: i18n.actions.yesAndIKnow,
            checkboxWarning: i18n.actions.checkboxWarning,
            okayText: i18n.general.accept,
            cancelText: i18n.general.cancel,
            containerClassName: 'actions-popup delete-school-popup',
            showLoading: true,
            onConfirm: () => handleDeleteSchool(id),
        });
    }

    function handleDeleteSchool(schoolId: number) {
        showAlert(
            <AlertWithUndo
                message={i18n.superAdmin.deletingSchool}
                onAction={() => {
                    deleteSchool(schoolId);
                }}
                buttonMessage={i18n.general.cancel}
            />,
        );
    }

    function handleSchoolInfoClick(school: SchoolRow) {
        navigate('school-info', {
            state: { schoolId: school.id, numOfStudents: school.numOfStudents, name: school.name, code: school.code },
        });
    }

    return (
        <div className="admin-table-container">
            <div className="pm-admin-table">
                <AdminTable<SchoolRow>
                    rowsPerPage={10}
                    id={adminQueryKeys.schoolsTable}
                    columns={columns}
                    rowsUrl="/api/schools/get-schools"
                    title={i18n.superAdmin.schools}
                    searchbar
                    rowId="id"
                    searchbarPlaceholder={i18n.general.searchByName}
                    extraHeader={
                        <AddButtons
                            showExcelButton={false}
                            addText={i18n.superAdmin.addSchool}
                            addFunc={() => {
                                setSelectedSchool({ name: '', code: '', id: 0 });
                                setIsAddSchoolPopupOpen(true);
                            }}
                        />
                    }

                    /**for now this is turned off because of an onClick conflict with the edit and delete buttons, waiting for a
                     * library update to fix this
                     */
                    // navigateOnRowClick={true}
                    // navigationFunction={(id, row) => {
                    //     handleSchoolInfoClick(row)
                    // }
                    // }
                />

                {/* edit message popup */}
                <GenericPopup
                    clearIcon
                    isForm
                    title={''}
                    open={isEditSchoolPopupOpen}
                    onCancel={() => setIsEditSchoolPopupOpen(false)}
                    containerClassName="super-admin-generic-popup"
                >
                    <SuperAdminAddSchoolForm
                        closePopup={() => setIsEditSchoolPopupOpen(false)}
                        initialValues={selectedSchool}
                        handleFormSubmit={handleEditSchoolSubmit}
                        isEditing={true}
                    />
                </GenericPopup>

                {/* add message popup */}
                <GenericPopup
                    clearIcon
                    isForm
                    title={''}
                    open={isAddSchoolPopupOpen}
                    onCancel={() => setIsAddSchoolPopupOpen(false)}
                    containerClassName="super-admin-generic-popup"
                >
                    <SuperAdminAddSchoolForm
                        closePopup={() => setIsAddSchoolPopupOpen(false)}
                        initialValues={selectedSchool}
                        handleFormSubmit={handleAddSchoolSubmit}
                        isEditing={false}
                    />
                </GenericPopup>
            </div>
        </div>
    );
};
