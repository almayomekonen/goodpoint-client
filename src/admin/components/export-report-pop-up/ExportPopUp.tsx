import { useMutation } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';

import { FormDateRangeInput, FormProvider, FormSubmitButton, useAlert, useFormConfig } from '@hilma/forms';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';

import { useI18n, useTranslate } from '../../../i18n/mainI18n';

import { provide } from '@hilma/tools';
import { Button, CircularProgress } from '@mui/material';
import { downloadFile } from '../../../common/functions/downloadFile';
import { dateRangeInputSchema } from '../../../lib/yup/yup-schemas/dateRangeInput.Schema';
import './exportPopUp.scss';

interface ExportPopUpProps {
    labelText: string;
    closePopup: () => void;
    queryPath: string;
    contentQuery: object;
    filename: string;
}

/**
A component that displays a popup with a date range input and a submit button for exporting data.
@param {string} label - The label of the date range input.
@param {Function} onSubmit - The function to be executed when the form is submitted.
@param {Function} closePopup - The function to be executed when the popup is closed.
@return {JSX.Element} - The ExportPopUp component.
*/

const ExportPopUp: React.FC<ExportPopUpProps> = ({ labelText, closePopup, queryPath, contentQuery, filename }) => {
    //ui focus ref
    const inputRef = useRef<HTMLInputElement | null>(null);

    // translate
    const translate = useTranslate();

    const { general, reportText } = useI18n((i18n) => {
        return {
            general: i18n.general,
            reportText: i18n.reportText,
        };
    });

    const alert = useAlert();
    const [noData, setNoData] = useState<boolean>(false);

    useFormConfig<{ dateRangeInput: [string, string] }>((form) => {
        form.translateFn = translate;
        form.onSubmit = handleSubmit;
    }, []);

    function handleLabelClick() {
        if (inputRef.current) inputRef.current.focus();
    }

    function handleClose() {
        closePopup();
    }

    const { status, mutate } = useMutation<ArrayBuffer, AxiosError, { dateRangeInput: [string, string] }>(
        ['export-report'],
        async (values: { dateRangeInput: [string, string] }) => {
            const { data } = await axios.post(
                queryPath,
                {
                    ...contentQuery,
                    dates: { from: values.dateRangeInput[0].toString(), to: values.dateRangeInput[1].toString() },
                },
                {
                    responseType: 'arraybuffer',
                },
            );

            return data;
        },
        {
            onSuccess: (reportData) => {
                alert(reportText.success, 'success');

                const outputFilename = `${filename}.xlsx`;

                downloadFile(reportData, outputFilename);
                closePopup();
            },
            onError(error) {
                if (error.status == 404) {
                    setNoData(true);
                } else {
                    alert(general.errorMessage, 'error');
                }
            },
        },
    );

    function handleSubmit(values: { dateRangeInput: [string, string] }) {
        mutate(values);
    }

    return (
        <div className="export-pop-up-container">
            <div className={clsx('datesWrapper')}>
                <label className="export-date-range-label" data-isrequired={true} onClick={handleLabelClick}>
                    {' '}
                    {labelText}
                </label>
                <FormDateRangeInput
                    name="dateRangeInput"
                    toInputRef={inputRef}
                    rounded
                    disableFuture
                    toPlaceholder={reportText.placeHolders.to}
                    fromPlaceholder={reportText.placeHolders.from}
                    textBetween=""
                    containerClassName="date"
                    onOpen={() => setNoData(false)}
                />
            </div>
            <span className="no-data">{noData && reportText.errors.noGoodPoints}</span>

            <div className="submit-btn">
                <Button variant="outlined" className={clsx('tab', 'cancel')} onClick={handleClose}>
                    {general.cancel}
                </Button>

                <FormSubmitButton className={clsx('tab', 'accept')} disabledOnError>
                    {status === 'loading' ? (
                        <CircularProgress className="spiner" thickness={3} size={30} variant="indeterminate" />
                    ) : (
                        reportText.title
                    )}
                </FormSubmitButton>
            </div>
        </div>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: { dateRangeInput: [null, null] },
        onSubmit: () => {},
        validationSchema: dateRangeInputSchema,
    },
])(ExportPopUp);
