import React from 'react';

import { ActionParams, AdminTable, GenericColumn, OnMountDropdownFilter } from '@hilma/forms';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAlert } from '../../../common/contexts/AlertContext';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { useI18n } from '../../../i18n/mainI18n';
import { useIsAdmin } from '../../common/functions/useIsAdmin';

import { Gender, PresetCategory } from '../../../common/enums';
import { popupType } from '../../../common/enums/popUpType.enum';
import { adminQueryKeys, adminQueryKeysWithPrefix } from '../../common/consts/adminTableQueryKeys';
import { PmRow } from '../../common/types/table-type/row-interfaces/pmRow.interface';

import AddMessageTemplate from '../../../components/preset-messages-bank/AddMessageTemplate';
import AddButtons from '../../components/add-buttons/AddButtons';
import DeletePopUp from '../../components/delete-popup/DeletePopUp';
import ExcelPMPopUp from '../../components/preset-messages-table/ExcelPmPopUp';

import { HelmetTitlePage } from '../../../components/HelmetTitlePage';
import '../../common/styles/adminTableStyle.scss';
import './presetMessagesAdmin.scss';

/**
 * PresetMessagesAdmin Component
 *
 * This component renders the admin table for managing preset messages.
 */
const PresetMessagesAdmin: React.FC = () => {
    const isSuperAdmin = useIsAdmin('SUPERADMIN');
    const alert = useAlert();
    const { openPopup, closePopup } = usePopup();
    const queryClient = useQueryClient();

    const i18n = useI18n((i18n) => {
        return {
            categories: i18n.openSentencesBar,
            general: i18n.general,
            presetMessages: i18n.presetMessagesBank,
            pagesTitles: i18n.pagesTitles,
        };
    });

    const columns: GenericColumn<PmRow>[] = [
        {
            key: 'text',
            label: i18n.general.text,
        },
        {
            key: 'presetCategory',
            label: i18n.general.category,
            renderColumn(row: PmRow) {
                return i18n.categories[row.presetCategory];
            },
        },
        {
            key: 'gender',
            label: i18n.general.gender,
            renderColumn(row) {
                return row.gender === Gender.MALE ? i18n.general.male : i18n.general.female;
            },
        },
        {
            key: 'numOfUses',
            label: i18n.general.numOfUses,
        },
        {
            type: 'icon',
            key: 'id',
            renderColumn(row) {
                // only superAdmin can edit system pm
                if (isSuperAdmin) {
                    return (
                        <button type="button" onClick={() => handleEditPMClick(row.id, row)} className="edit-button">
                            <EditIcon />
                        </button>
                    );
                } else {
                    if (row.schoolId !== null) {
                        return (
                            <button
                                type="button"
                                onClick={() => handleEditPMClick(row.id, row)}
                                className="edit-button"
                            >
                                <EditIcon />
                            </button>
                        );
                    }
                }
            },
        },
    ];

    const dropdownFilters: OnMountDropdownFilter<PmRow>[] = [
        {
            noneOption: i18n.general.allGenders,
            columnKey: 'gender',
            dropDownKey: 'genders',
            multiple: true,
            options: [
                {
                    content: i18n.general.male,
                    filter: (gender: Gender) => gender === Gender.MALE,
                    optionKey: Gender.MALE,
                },
                {
                    content: i18n.general.female,
                    filter: (gender: Gender) => gender === Gender.FEMALE,
                    optionKey: Gender.FEMALE,
                },
            ],
            selectProps: {
                MenuProps: {
                    style: {
                        position: 'absolute',
                        zIndex: 1,
                    },
                    disableScrollLock: true,
                },
                placeholder: i18n.presetMessages.admin.filterByGender,
            },
        },

        {
            noneOption: i18n.general.allCategories,
            columnKey: 'presetCategory',
            dropDownKey: 'categories',
            multiple: true,
            options: [
                {
                    content: i18n.categories.educational,
                    filter: (presetCategory: PresetCategory) => presetCategory === PresetCategory.educational,
                    optionKey: PresetCategory.educational,
                },
                {
                    content: i18n.categories.social,
                    filter: (presetCategory: PresetCategory) => presetCategory === PresetCategory.social,
                    optionKey: PresetCategory.social,
                },
                {
                    content: i18n.categories.emotional,
                    filter: (presetCategory: PresetCategory) => presetCategory === PresetCategory.emotional,
                    optionKey: PresetCategory.emotional,
                },
                {
                    content: i18n.categories.other,
                    filter: (presetCategory: PresetCategory) => presetCategory === PresetCategory.other,
                    optionKey: PresetCategory.other,
                },
            ],
            selectProps: {
                MenuProps: {
                    style: {
                        position: 'absolute',
                        zIndex: 1,
                    },
                    disableScrollLock: true,
                },
                placeholder: i18n.presetMessages.admin.filterByCategory,
            },
        },
        ...(!isSuperAdmin
            ? [
                  {
                      noneOption: i18n.general.allCreators,
                      columnKey: 'schoolId',
                      dropDownKey: 'creators',
                      multiple: true,
                      options: [
                          {
                              content: i18n.general.school,
                              filter: (schoolId: number) => schoolId !== null,
                              optionKey: 'school',
                          },
                          {
                              content: i18n.general.defaultSystem,
                              filter: (schoolId: number) => schoolId === null,
                              optionKey: 'default',
                          },
                      ],
                      selectProps: {
                          MenuProps: {
                              style: {
                                  position: 'absolute',
                                  zIndex: 1,
                              },
                              disableScrollLock: true,
                          },
                          placeholder: i18n.presetMessages.admin.filterByCreator,
                      },
                  } as OnMountDropdownFilter<PmRow>, // Explicitly specify the type here
              ]
            : []),
    ];

    // handle pop-up deletion
    async function handlePmsDeletionConfirmation(selected: string[], params: ActionParams<PmRow>): Promise<void> {
        // I show the "Are you sure?" popup
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.general.areYouSure,
            content: (
                <DeletePopUp
                    categoryTitle={i18n.general.openingSentences}
                    allChecked={params.allChecked}
                    selected={selected}
                    count={params.selectedAmount!}
                    onDelete={async () => {
                        await deletePm(selected, params);
                        await queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.PMTable] });
                    }}
                />
            ),
            deleting: true,
        });
    }

    const deletePm = async (selected: string[], params: ActionParams<PmRow>) => {
        try {
            // Make API call to delete the selected students
            await axios.delete('/api/preset-messages/delete-admin-pms', {
                data: {
                    selected,
                    params,
                },
            });
            alert(`${i18n.general.openingSentences} ${i18n.general.deletedSuccessfully}`, 'success');
        } catch (error: any) {
            alert(error, 'error');
        }
    };

    const handleEditPMClick = (id: string | number | undefined, pmData: PmRow) => {
        openPopup(popupType.REGULAR, {
            title: i18n.general.editPresetMessage,
            content: (
                <AddMessageTemplate
                    typeOfPm={'admin'}
                    onSave={closePopup}
                    editOrAdd="edit"
                    initialValues={{
                        id: pmData?.id,
                        text: pmData?.text,
                        presetCategory: pmData?.presetCategory,
                        gender: pmData?.gender,
                    }}
                />
            ),
        });
    };

    const handleAddPmClick = () => {
        openPopup(popupType.REGULAR, {
            title: i18n.presetMessages.addMessagePopup.addOpeningMessage,
            content: <AddMessageTemplate typeOfPm={'admin'} onSave={closePopup} editOrAdd="add" />,
        });
    };

    function handleExcelPopUp() {
        openPopup(popupType.REGULAR, {
            title: i18n.presetMessages.excelPopUp.addExcel,
            content: <ExcelPMPopUp />,
        });
    }

    return (
        <>
            <HelmetTitlePage title={i18n.pagesTitles.adminPM} />

            <div className="admin-table-container">
                <div className="pm-admin-table">
                    <AdminTable<PmRow>
                        id={adminQueryKeys.PMTable}
                        columns={columns}
                        rowsUrl="/api/preset-messages/get-admin-preset-messages"
                        title={i18n.general.openingSentences}
                        rowsPerPage={10} // amount of rows per page
                        searchbar
                        rowId="id"
                        checkboxColumn
                        searchbarPlaceholder={i18n.general.searchByName}
                        extraHeader={
                            <AddButtons
                                addText={i18n.presetMessages.addMessagePopup.title}
                                addFunc={handleAddPmClick}
                                addExcelFunc={handleExcelPopUp}
                                excelText={i18n.general.addByExcel}
                            />
                        }
                        dropdownFilters={dropdownFilters}
                        actionButtons={[
                            {
                                label: i18n.general.delete,
                                icon: <DeleteIcon />,
                                onAction: async (selected, params) =>
                                    handlePmsDeletionConfirmation(selected as string[], params),
                                shouldRefetch: true,
                                shouldResetCheckboxes: true,
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
};

export default PresetMessagesAdmin;
