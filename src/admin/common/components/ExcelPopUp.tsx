import React, { ReactNode } from 'react';

import axios from 'axios';
import * as yup from 'yup';

import { UploadError, useFiles } from '@hilma/fileshandler-client';
import { FormFileInput, FormProvider, FormSubmitButton, useAlert, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import leftArrow from '/images/leftArrow.svg';

import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import { useI18n, useTranslate } from '../../../i18n/mainI18n';
import { ExcelMimeTypes } from '../consts/ExcelMimeTypes';
import { useFormatExcelErrors } from '../hooks/useFormatExcelErrors';
import { ExcelUploadError, ExcelUploadResponse } from '../types/excelUploadResponse';

import { Button } from '@mui/material';
import { useUser } from '../../../common/contexts/UserContext';
import { downloadFile } from '../../../common/functions/downloadFile';
import { AdminQueryKeys, TABLE_LOAD_PREFIX } from '../consts/adminTableQueryKeys';
import './excelPopUp.scss';

type ExcelPopUpProps = {
    uploadUrl: string;
    formatInstruction: ReactNode;
    textInsideUpload: string;
    generateSuccessMessage: (response: ExcelUploadResponse) => string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    typeErrorMsg?: string;
    queryKey: AdminQueryKeys;
    exampleFileUrl?: string;
};

/**
A React component that displays a pop-up for uploading an Excel file.
@param {string} uploadUrl - The URL to which the Excel file will be uploaded.
@param {ReactNode} formatInstruction - The instructions to be displayed for formatting the Excel file.
@param {string} textInsideUpload - The text to be displayed inside the upload button.
@param {Function} formatExcelErrorsForPrint - A function that formats the Excel errors to be displayed to the user.
@param {Function} onSuccess - A function to be executed when the Excel file is successfully uploaded.
@param {Function} onError - A function to be executed when an error occurs during the Excel file upload.
@param {string} typeErrorMsg - The error message to be displayed when the file type is invalid.
@returns {ReactElement} A React component that displays a pop-up for uploading an Excel file.
*/

const ExcelPopUp: React.FC<ExcelPopUpProps> = ({
    uploadUrl,
    textInsideUpload,
    onSuccess,
    onError,
    generateSuccessMessage,
    typeErrorMsg,
    formatInstruction,
    queryKey,
    exampleFileUrl,
}) => {
    // data
    const filesUploader = useFiles();
    const queryClient = useQueryClient();

    //hooks ui
    const showAlert = useAlert();
    const { openPopup, closePopup } = usePopup();
    //translation:
    const translate = useTranslate();
    const formatExcelErrors = useFormatExcelErrors();

    // get the currant school name from the user context
    const {
        user,
        user: { currSchoolId },
    } = useUser();
    const school = user.schools.find((school) => school.schoolId === currSchoolId) || { schoolName: '' };

    const { general, excelTexts, ...i18n } = useI18n((i18n) => {
        return {
            excelTexts: i18n.excelTexts,
            general: i18n.general,
            errors: i18n.errors,
        };
    });

    // config hilma forms translation and submission
    useFormConfig((form) => {
        form.translateFn = translate;
        form.onSubmit = handleSubmit;
    }, []);

    const { mutate } = useMutation<ExcelUploadResponse, ExcelUploadError, any>(
        ['upload-Excel'],
        async (file: { excel: string }) =>
            (await filesUploader.post<ExcelUploadResponse>(uploadUrl, { file: file.excel })).data,
        {
            onSuccess: handleSuccess,
            onError: handleError,
        },
    );

    async function handleSuccess(data: ExcelUploadResponse): Promise<void> {
        const outputFilename = `${school.schoolName}.xlsx`;

        if (onSuccess) onSuccess();

        showAlert(generateSuccessMessage(data), 'success');

        //  handling excel buffer
        downloadFile(data.buffer ? data.buffer.data : null, outputFilename);

        queryClient.invalidateQueries({ queryKey: [TABLE_LOAD_PREFIX + queryKey] });
        closePopup();
    }

    function handleError(error: ExcelUploadError | UploadError) {
        if (onError) onError(error);

        if (isExcelUploadError(error)) {
            const errorList = formatErrors(error);
            displayErrorPopup(errorList);
        } else {
            displayErrorPopup(error.type === 'file-size' ? [i18n.errors.fileSize] : [excelTexts.errorFileType]);
        }

        showAlert(i18n.errors.operationFailed, 'error');
    }

    function displayErrorPopup(errorList: string[] | null) {
        openPopup(popupType.REGULAR, {
            title: excelTexts.errorTitle,
            okayText: general.understood,
            content: (
                <div className="error-excel-container">
                    <ul>
                        {errorList?.map((el, index) => {
                            return el ? (
                                <li className="error-excel-li" key={index + el}>
                                    {el.trim()}
                                </li>
                            ) : null;
                        })}
                    </ul>
                </div>
            ),
        });
    }

    function formatErrors(errorData: ExcelUploadError) {
        return errorData?.data.errors ? formatExcelErrors(errorData.data.errors) : null;
    }
    // type guard for error
    function isExcelUploadError(error: ExcelUploadError | UploadError): error is ExcelUploadError {
        return (error as ExcelUploadError).data !== undefined;
    }

    function handleSubmit(values: any): void | Promise<any> {
        mutate(values);
    }

    async function handleExcelFileExampleDownload() {
        const { data } = await axios(`/api/excel-file-example/${exampleFileUrl}`, { responseType: 'arraybuffer' });
        downloadFile(data, exampleFileUrl);
    }

    return (
        <>
            <div className="excel-pop-up-container">
                {formatInstruction}
                <FormFileInput
                    name="excel"
                    type="file"
                    filesUploader={filesUploader}
                    inputText={textInsideUpload}
                    mimeTypes={ExcelMimeTypes}
                    typeErrorMsg={typeErrorMsg ?? excelTexts.errorFileType}
                    onError={(ExcelUploadError) => {
                        handleError(ExcelUploadError);
                        return ExcelUploadError;
                    }}
                />
                <div className="form-Submit-continuer">
                    {exampleFileUrl && (
                        <Button className="download-example-file" onClick={handleExcelFileExampleDownload}>
                            {excelTexts.exampleFile}
                        </Button>
                    )}

                    <FormSubmitButton className="form-Submit" disabledOnError>
                        {excelTexts.upload} <img src={leftArrow} className="prev" alt="" />
                    </FormSubmitButton>
                </div>
            </div>
        </>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            excel: '',
        },
        onSubmit: () => {},
        initialErrors: { excel: 'errors.requiredField||' },
        validationSchema: yup.object({
            excel: yup.string().required(),
        }),
    },
])(ExcelPopUp);
