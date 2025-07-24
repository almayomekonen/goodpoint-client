import React, { Fragment } from 'react';
import { ErrorMsg, RTL, SelectOption, useField, useFormClassName } from '@hilma/forms';
import { useI18n } from '../../i18n/mainI18n';
import { GRADES_REGEX } from '../../admin/common/consts/gradesRegex';
import { Autocomplete, TextField, styled } from '@mui/material';
import { SelectOptionAC } from '../react-query/hooks/useGradeDropdownFilters';

import './multipleSelectAutoComplete.scss';

interface MyFormsComponentProps {
    name: string | { _key: string };
    label: string;
    options: SelectOptionAC[];
    multiple?: boolean;
    freeSolo?: boolean;
    isRequired?: boolean;
    disabled?: boolean;
}

const GroupHeader = styled('div')({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: '#154754',
    backgroundColor: '#CDE7EC',
    fontWeight: 'bold',
});

/**
 * MultipleSelectAutoComplete Component
 *
 * @component
 * @param {string} props.name - The name of the component.
 * @param {string} props.label - The label of the component.
 * @param {SelectOption[]} props.options - The options for the autocomplete select.
 * @param {boolean} [props.multiple] - Indicates if multiple values can be selected.
 * @param {boolean} [props.freeSolo=false] - Indicates if free text input is allowed.
 * @param {boolean} [props.isRequired] - Indicates if the field is required.
 * @param {boolean} [props.disabled] - Indicates if the field is disabled.
 * @returns {React.FC} The MultipleSelectAutoComplete component.
 * @example 
 *  <FormProvider
        initialValues={{classes:""}}
        onSubmit={submit}
        validationSchema={schema}
    >
 *      <MultipleSelectAutoComplete
            name="classes"
            label={"[$someString]"}
            options={"[$someObjects]"}
            isRequired
         />

        <FormSubmitButton>
            {"save"}
        </FormSubmitButton>
                        
    </FormProvider>
 */

const MultipleSelectAutoComplete: React.FC<MyFormsComponentProps> = ({
    name,
    label,
    options,
    multiple,
    freeSolo = false,
    isRequired,
    disabled,
}) => {
    const [field, meta, helpers] = useField(name);
    const [rootClsx, sectionClsx] = useFormClassName(meta.touched ? meta.error : undefined, disabled);

    const { gradesList, general } = useI18n((i18n) => {
        return {
            gradesList: i18n.schoolGrades,
            general: i18n.general,
        };
    });

    return (
        <>
            <div className={sectionClsx('container', 'SelectAutoComplete')}>
                <span className={sectionClsx('label', 'SelectAutoComplete')}>
                    {label}
                    {isRequired ? <span style={{ color: 'red' }}> *</span> : null}
                </span>
                <RTL active>
                    <Autocomplete
                        {...field}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        className={rootClsx('SelectAutoComplete')}
                        multiple={multiple}
                        options={options}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            return (option as SelectOption).content;
                        }}
                        groupBy={(option) => {
                            const grade = (option as SelectOption).content.match(GRADES_REGEX)?.join('');
                            return grade ? `${gradesList.grade} ${grade}` : '';
                        }}
                        clearIcon={null}
                        freeSolo={freeSolo}
                        ListboxProps={{ dir: 'rtl' }}
                        renderInput={(params) => (
                            <TextField {...params} className={sectionClsx('renderInput', 'SelectAutoComplete')} />
                        )}
                        renderGroup={(params) => {
                            return (
                                <Fragment key={params.key}>
                                    {/* when loading we want to remove the word grade and not show any children  */}
                                    <GroupHeader>
                                        {params.group.split(' ')[1] !== general.loading
                                            ? params.group
                                            : general.loading}
                                    </GroupHeader>
                                    {params.group.split(' ')[1] !== general.loading ? (
                                        <div>{params.children}</div>
                                    ) : null}
                                </Fragment>
                            );
                        }}
                        onChange={(e, value) => {
                            helpers.setTouched(true);
                            helpers.setValue(value);
                        }}
                    />
                </RTL>
                <ErrorMsg
                    error={meta.error}
                    activeWhen={meta.touched}
                    className={sectionClsx('errorMsg', 'SelectAutoComplete')}
                />
            </div>
        </>
    );
};

export default MultipleSelectAutoComplete;
