import {
    FormAutocomplete,
    FormProvider,
    FormSelect,
    FormTextInput,
    useAlert,
    useForm,
    useFormConfig,
} from '@hilma/forms';
import { provide } from '@hilma/tools';
import { FormikValues } from 'formik';
import { FC, useEffect } from 'react';
import { SchoolGrades, SortedGrades as gradesKeys } from '../../../common/enums';
import { useI18n, useTranslate } from '../../../i18n/mainI18n';
import { useAddOrEditClass, useAddOrEditStudyGroup } from '../../../lib/react-query/hooks/useClasses';
import { useGetTeachersQuery } from '../../../lib/react-query/hooks/useTeachers';
import { classesSchema } from '../../../lib/yup/yup-schemas/classesSchema.Schema';
import { studyGroupSchema } from '../../../lib/yup/yup-schemas/studyCroupSchema.Schema';
import { ClassFormKeys } from '../../common/types/table-type/classFormKeys.type';
import { StudyGroupFormKeys } from '../../common/types/table-type/studyGroupFormKeys.type';
import AdminPopupFormButtons from '../admin-popup-buttons/AdminPopupFormButtons';
import './addClassPopupContent.scss';
interface AddClassPopupContent {
    handleClose: () => void;
    editContent?: ClassFormKeys | StudyGroupFormKeys;
    classType: 'studyGroup' | 'class';
}

/**
 * AddClassPopupContent is a component that renders the content for adding or editing a class or study group in a popup.
 * @component
 * @param {Function} handleClose - The function to handle closing the popup.
 * @param {ClassFormKeys | StudyGroupFormKeys} editContent - The data to be edited of either a class or study group. (Optional)
 * @param {'studyGroup' | 'class'} classType - The type of the content: 'studyGroup' for a study group, 'class' for a class.
 * @returns {JSX.Element} A React element representing the AddClassPopupContent component.
 */
const AddClassPopupContent: FC<AddClassPopupContent> = ({ handleClose, editContent, classType }) => {
    const { data: teachersDetails } = useGetTeachersQuery();
    const addOrEditClass = useAddOrEditClass();
    const addOrEditStudyGroup = useAddOrEditStudyGroup();
    const translate = useTranslate();
    const alert = useAlert();
    const i18n = useI18n((i18n) => {
        return {
            gradesTexts: i18n.schoolGrades.gradesList,
            schoolGrades: i18n.schoolGrades,
            adminClassesTable: i18n.adminClassesTable,
            general: i18n.general,
        };
    });

    const { setValues } = useForm();

    useEffect(() => {
        if (editContent) {
            setValues(editContent);
        }
    }, []);

    useFormConfig((form) => {
        form.translateFn = translate;
        form.onSubmit = submit;
        form.validationSchema = classType === 'class' ? classesSchema : studyGroupSchema;
    }, []);

    async function submit(values: FormikValues) {
        if (classType == 'class') {
            const details = {
                id: values.id,
                classIndex: values.classIndex,
                grade: values.grade,
                teacherId: values.teacher?.id ?? null,
            };
            await addOrEditClass.mutateAsync(details);
            alert(
                editContent ? i18n.adminClassesTable.successClassEditing : i18n.adminClassesTable.successClassAdding,
                'success',
            );
        } else {
            const details = {
                id: values.id,
                name: values.name,
                teacherId: values.teacher?.id ?? null,
                studyGroupGrades: values.grades.map((grade: SchoolGrades) => ({ grade })),
            };
            await addOrEditStudyGroup.mutateAsync(details);
            alert(
                editContent
                    ? i18n.adminClassesTable.successStudyGroupEditing
                    : i18n.adminClassesTable.successStudyGroupAdding,
                'success',
            );
        }
    }

    return (
        <div className="add-class-popup-content-container">
            <div className="first-row">
                <FormSelect
                    name={classType === 'class' ? 'grade' : 'grades'}
                    options={gradesKeys.map((gradeKey) => {
                        return {
                            content: i18n.gradesTexts[gradeKey],
                            value: gradeKey,
                        };
                    })}
                    label={i18n.schoolGrades.grade}
                    data-isrequired={true}
                    multiple={classType === 'class' ? false : 'checkbox'}
                />
                {classType == 'class' ? (
                    <FormTextInput
                        name="classIndex"
                        label={i18n.adminClassesTable.classIndex}
                        data-isrequired={true}
                        maxLength={2}
                        type="number"
                        inputProps={{ min: 1, max: 15 }}
                    />
                ) : (
                    <FormTextInput name="name" label={i18n.adminClassesTable.nameOfClass} data-isrequired={true} />
                )}
            </div>

            <FormAutocomplete
                name="teacher"
                label={i18n.general.teacher}
                options={
                    teachersDetails
                        ? teachersDetails.map((teacher) => ({
                              label: `${teacher.firstName} ${teacher.lastName}` ?? '',
                              id: teacher.id ?? '',
                          }))
                        : []
                }
                data-isrequired={true}
            />
            <div>
                <AdminPopupFormButtons handleClose={handleClose} addOrUpdate={editContent ? 'update' : 'add'} />
            </div>
        </div>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            grade: '',
            classIndex: '',
            teacher: '',
            name: '',
            grades: [],
        },
        onSubmit: () => {},
    },
])(AddClassPopupContent);
