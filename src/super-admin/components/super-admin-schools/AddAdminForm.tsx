import {
    FormProvider,
    FormSelect,
    FormSubmitButton,
    FormTextInput,
    useAlert,
    useForm,
    useFormConfig,
} from '@hilma/forms';
import { provide } from '@hilma/tools';
import { Box, Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { FormikValues } from 'formik';
import { Dispatch, FC, SetStateAction, Suspense } from 'react';
import { adminQueryKeysWithPrefix } from '../../../admin/common/consts/adminTableQueryKeys';
import { SuccessAddingTeacherPopup } from '../../../admin/components/teachers-admin-table/add-pop-teacher/SuccessAddingTeacherPopup';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { Gender } from '../../../common/enums';
import { popupType } from '../../../common/enums/popUpType.enum';
import { Admin } from '../../../common/types/admin.type';
import { useI18n, useTranslate } from '../../../i18n/mainI18n';
import { useAddAdmin } from '../../../lib/react-query/hooks/useSuperAdminSchools';
import { AdminSchema } from '../../../lib/yup/yup-schemas/adminSchema.Schema';

interface Props {
    closePopup: () => void;
    setIsAddAdminModalOpen: Dispatch<SetStateAction<boolean>>;
    schoolId: number;
}

export const AddAdminForm: FC<Props> = ({ closePopup, schoolId, setIsAddAdminModalOpen }) => {
    const i18n = useI18n((i) => {
        return {
            general: i.general,
            superAdmin: i.superAdmin,
        };
    });
    const { setErrors } = useForm();
    const queryClient = useQueryClient();
    const translate = useTranslate();
    const showAlert = useAlert();
    const { mutate: addAdmin } = useAddAdmin(schoolId);
    const { openPopup } = usePopup();
    //setting the onSubmit function
    useFormConfig(
        (form) => {
            form.translateFn = translate;
            form.onSubmit = handleAddAdmin;
        },
        [handleAddAdmin],
    );

    function handleAddAdmin(data: FormikValues) {
        try {
            addAdmin(data as Admin, {
                onError: (e: any) => {
                    //check if status is 409, meaning admin already exists
                    if (e.status === 409) {
                        setErrors({ username: i18n.superAdmin.adminAlreadyExists });
                    }
                    //invalid email through the dto
                    if (e.status === 400) {
                        setErrors({ username: i18n.superAdmin.invalidEmail });
                    }
                },
                onSuccess: (data: any) => {
                    //alert for successful edit
                    showAlert(i18n.superAdmin.addedAdmin, 'success');
                    queryClient.invalidateQueries([`${adminQueryKeysWithPrefix.adminsTable}-${schoolId}`]);

                    openPopup(popupType.REGULAR, {
                        title: i18n.superAdmin.addedAdmin,
                        content: (
                            <Suspense fallback={<div>{i18n.general.loading}...</div>}>
                                <SuccessAddingTeacherPopup isAdmin newPassword={data.password} />
                            </Suspense>
                        ),
                    });
                    setIsAddAdminModalOpen(false);
                },
            });
        } catch (e) {
            showAlert(i18n.superAdmin.failedToAddAdmin, 'error');
        }
    }
    return (
        <div className="super-admin-school-form add-admin-form add-or-edit-container">
            <h2 className="super-admin-school-form-title">{i18n.superAdmin.addAdmin}</h2>
            {/**inputs from hilma forms */}
            <div className="super-admin-form-inputs">
                <FormTextInput
                    name="firstName"
                    containerClassName="flex-box-elem"
                    placeholder={i18n.superAdmin.firstName}
                    data-isrequired={true}
                    key="firstName"
                    label={i18n.superAdmin.firstName}
                />

                <FormTextInput
                    name="lastName"
                    containerClassName="flex-box-elem"
                    placeholder={i18n.superAdmin.lastName}
                    data-isrequired={true}
                    key="lastName"
                    label={i18n.superAdmin.lastName}
                />
            </div>

            <div className="super-admin-form-inputs">
                <FormTextInput
                    name="username"
                    containerClassName="flex-box-elem"
                    placeholder={i18n.superAdmin.email}
                    data-isrequired={true}
                    key="username"
                    label={i18n.superAdmin.email}
                />

                <FormSelect
                    label={i18n.general.gender}
                    options={[
                        { value: Gender.MALE, content: i18n.general.male },
                        { value: Gender.FEMALE, content: i18n.general.female },
                    ]}
                    name={'gender'}
                    containerClassName="add-admin-radio-group"
                />
            </div>

            <Box gap={'1rem'} className="flex-center">
                <Button className="super-admin-cancel-button " onClick={closePopup}>
                    {i18n.general.cancel}
                </Button>
                <FormSubmitButton className={clsx('super-admin-submit-button', 'flex-box-elem')}>
                    {i18n.general.add}
                </FormSubmitButton>
            </Box>
        </div>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            gender: Gender.MALE,
        },
        onSubmit: () => {},
        validationSchema: AdminSchema,
    },
])(AddAdminForm);
