import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import * as yup from 'yup';
//functions
import { sortObjBy } from '../../common/functions';
import { isDesktop } from '../../common/functions/isDesktop';
import { savingEvents } from '../../components/GoogleAnalytics';
//hooks
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { useAlert } from '../../common/contexts/AlertContext';
import { useI18n, useTranslate } from '../../i18n/mainI18n';
//components
import {
    FormDateRangeInputMui,
    FormProvider,
    FormRadioGroup,
    FormSelectMui,
    FormSubmitButton,
    FormTextInput,
    useForm,
    useFormConfig,
} from '@hilma/forms';
import { provide } from '@hilma/tools';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, IconButton, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
import Loading from '../../components/Loading';
import { OvalWithX } from '../../components/OvalWithX';
import TitledHeader from '../../components/titled-header/TitledHeader';
import { SelectStudentList } from './SelectStudentList';
import { SelectStudentsPopup } from './SelectStudentsPopup';

//types && consts
import { RADIO_OPTIONS } from '../../common/consts/export-report-radio-options';
import { ClassList } from '../../common/types/UserContext.type';
import { StudentsByClass } from '../../common/types/studentsByClass.type';
import { EMAIL_SCHEMA } from '../../lib/yup/yup-schemas/common-schemas';

//scss
import { useUser } from '../../common/contexts/UserContext';
import { downloadFile } from '../../common/functions/downloadFile';

import '../../components/send-gp-desktop/send-gp-desktop.scss';
import './exportReport.scss';
import { dateToDatetime } from '../../common/functions/date-to-datetime';

const { CHOOSE_STUDENT, ALL_STUDENTS } = RADIO_OPTIONS;

const schema = yup.object({
    sendToEmail: yup.string().when('isDesktop', {
        is: () => !isDesktop(),
        then: () => yup.string().concat(EMAIL_SCHEMA).required(),
        otherwise: () => EMAIL_SCHEMA,
    }),
    forWho: yup.string().required(),
    grade: yup.string().required(),
    dates: yup.array().of(yup.date().required('errors.required||')),
    who: yup.string(),
});

type Modify<T, R> = Omit<T, keyof R> & R;
type formValues = Modify<yup.InferType<typeof schema>, { dates: (null | Date)[] }>;

/**
 * _ExportReport
 * -----------------------
 * This is the main component for exporting reports. It allows users to select a grade, choose whether to generate a report for all students or select specific students,
 * choose a date range, and optionally provide an email address to send the report. The component uses React Query for API data fetching and mutations, and integrates with
 * Hilma library for form handling and validation. The selected options are used to generate a PDF report and initiate the download or email sending.
 *
 * @returns {JSX.Element} The ExportReport component JSX element.
 */
const _ExportReport = () => {
    const alert = useAlert();
    const colors = useTheme();
    const navigate = useNavigate();
    const isInDesktop = isDesktop();

    const { reportText, grades, errorText, pagesTitles } = useI18n((i18n) => {
        return {
            errorText: i18n.errors,
            reportText: i18n.reportText,
            grades: i18n.schoolGrades.gradesList,
            pagesTitles: i18n.pagesTitles,
        };
    });

    const {
        user: { username },
    } = useUser();

    const [chosenStudentsObj, setChosenStudentsObj] = useImmer<{ [key: string]: string }>({});
    const [open, setOpen] = useState(false);
    const [noData, setNoData] = useState<boolean>(false);
    const translate = useTranslate();
    const { values, setFieldValue } = useForm<formValues>();

    useFormConfig(
        (form) => {
            form.translateFn = translate;
            form.onSubmit = () => mutate();
        },
        [chosenStudentsObj, translate],
    );

    //API_CALLS
    const { isLoading, data: allSchoolClasses = [] } = useQuery<ClassList[]>(['populated-classes'], async () => {
        return (await axios.get<ClassList[]>('/api/classes/get-populated-school-classes')).data;
    });

    const { data: allClassStudents } = useQuery<StudentsByClass[]>(
        ['classStudents', values.grade],
        async () => (await axios.get<StudentsByClass[]>(`/api/student/get-students-report/${values.grade}`)).data,
        { enabled: Boolean(values.grade) },
    );

    //USE_EFFECTS
    useEffect(() => {
        if (values.forWho === CHOOSE_STUDENT && !values.grade) {
            alert(reportText.errors.gradeBeforeStudent, 'error');
            setFieldValue('forWho', ALL_STUDENTS);
        }
    }, [values.forWho]);

    useEffect(() => {
        if (values.grade) {
            setChosenStudentsObj({});
        }
    }, [values.grade]);

    const { mutate, isLoading: isMutatePdfLoading } = useMutation<{ data: Blob; fileType?: string }, AxiosError>(
        ['export-pdf'],
        async () => {
            const from = dateToDatetime(values.dates[0]!);
            const to = dateToDatetime(values.dates[1]!);
            const res = await axios.post<Blob>(
                '/api/student/create-students-report-pdf',
                {
                    classId: values.grade,
                    allStudents: values.forWho === ALL_STUDENTS,
                    studentsIds: Object.keys(chosenStudentsObj),
                    dates: { from, to },
                    email: values.sendToEmail,
                },
                {
                    responseType: 'blob',
                },
            );

            return { data: res.data, fileType: res.headers['content-type'] };
        },
        {
            onSuccess: (res) => {
                const fileName =
                    res.fileType === 'application/zip'
                        ? `${reportText.reportGrade}.zip`
                        : `${reportText.reportGrade || reportText.reportStudent}.pdf`;
                downloadFile(res.data, fileName);
                const extraParam = values.sendToEmail
                    ? { type: 'email', username, email: values.sendToEmail }
                    : { type: 'zip', username };
                savingEvents('export_report', extraParam);
                alert(isInDesktop ? reportText.success : reportText.sendSuccess, 'success');
                setNoData(false);
            },
            onError: (error) => {
                if (error.status == 404) {
                    setNoData(true);
                } else {
                    alert(reportText.errors.exportErrorWhileSending, 'error');
                }
            },
        },
    );

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <HelmetTitlePage title={pagesTitles.exportReport} />
            <div className={clsx('custom-scroll-bar', 'main-page-export-report', !isDesktop() && 'titled-page')}>
                {!isDesktop() && (
                    <TitledHeader size="small" icon="back" onNavigate={() => navigate(-1)} title={reportText.title} />
                )}

                <div className={'reportMainWrapper'}>
                    <div className={clsx('chooseClassWrapper', 'flexColumn')}>
                        <FormSelectMui
                            name="grade"
                            label={reportText.labels.chooseGrade}
                            displayEmpty
                            noneOption={allSchoolClasses ? reportText.placeHolders.choose : reportText.errors.noClasses}
                            //Retrieving the SELECT options from the classes data. We pass the string and the id so we can send the id to the server on submit
                            options={
                                allSchoolClasses?.length
                                    ? allSchoolClasses
                                          .map((val) => {
                                              return {
                                                  content: `${grades[val.grade]}${val.classIndex}`,
                                                  value: val.id,
                                              };
                                          })
                                          .sort((a, b) => sortObjBy(a, b, 'content'))
                                    : []
                            }
                            disabled={!allSchoolClasses.length}
                            containerClassName={'gradeInput'}
                            MenuProps={{ style: { height: '18em' } }}
                            data-isrequired={true}
                        />
                    </div>

                    <div className={clsx('forWhoWrapper', 'flexColumn')}>
                        <FormRadioGroup
                            label={reportText.labels.forWho}
                            name="forWho"
                            options={[
                                { content: reportText.radioOptions[ALL_STUDENTS], value: ALL_STUDENTS },
                                { content: reportText.radioOptions[CHOOSE_STUDENT], value: CHOOSE_STUDENT },
                            ]}
                            containerClassName="radio"
                            buttonFill={colors.customColors.dark_blue1}
                            data-isrequired={true}
                        />
                        {CHOOSE_STUDENT === values.forWho && Boolean(values.grade) && (
                            <>
                                <Button
                                    onClick={() => {
                                        !allClassStudents!.length ? alert(errorText.noData, 'error') : setOpen(true);
                                    }}
                                    className="input-button"
                                >
                                    <span className="button-placeholder">{reportText.placeHolders.searchByName}</span>
                                    <SearchIcon />
                                </Button>

                                {isInDesktop ? (
                                    <Dialog open={open} onClose={() => setOpen(false)}>
                                        <Box className="send-gp-desktop-container send-gp-desktop-modal">
                                            {/* X icon */}
                                            <IconButton
                                                className="clean-no-style-button send-gp-clear-button"
                                                onClick={() => setOpen(false)}
                                            >
                                                <ClearIcon className="send-gp-clear-icon" />
                                            </IconButton>

                                            {/*the students list */}
                                            <SelectStudentList
                                                setChosenStudents={setChosenStudentsObj}
                                                chosenStudents={chosenStudentsObj}
                                                close={() => setOpen(false)}
                                                studentsList={allClassStudents!}
                                                grade={allSchoolClasses?.find((val) => val.id === Number(values.grade))}
                                            />
                                        </Box>
                                    </Dialog>
                                ) : (
                                    <SelectStudentsPopup
                                        setChosenStudents={setChosenStudentsObj}
                                        chosenStudents={chosenStudentsObj}
                                        open={open}
                                        setOpen={setOpen}
                                        studentNames={allClassStudents!}
                                        data-isrequired={true}
                                    />
                                )}
                                <div className="oval-wrapper">
                                    {Object.keys(chosenStudentsObj).map((key) => (
                                        <OvalWithX
                                            key={key}
                                            text={chosenStudentsObj[key]}
                                            onClick={() =>
                                                setChosenStudentsObj((prev) => {
                                                    delete prev[key];
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className={clsx('datesWrapper', 'flexColumn')}>
                        <label className="label">
                            {' '}
                            {reportText.labels.dates}
                            <span style={{ color: 'red' }}> *</span>{' '}
                        </label>
                        <FormDateRangeInputMui
                            disableFuture
                            toPlaceholder={reportText.placeHolders.to}
                            fromPlaceholder={reportText.placeHolders.from}
                            textBetween=""
                            name="dates"
                            containerClassName="date"
                            data-isrequired={true}
                        />
                    </div>
                    {!isInDesktop && (
                        <div className={clsx('emailWrapper', 'flexColumn')}>
                            <FormTextInput
                                label={reportText.labels.sendToEmail}
                                name="sendToEmail"
                                type="email"
                                containerClassName="input"
                                placeholder={username}
                                autoComplete="on"
                                data-isrequired={true}
                            />
                        </div>
                    )}
                    <span className="no-data">{noData && reportText.errors.noGoodPoints}</span>
                    <FormSubmitButton className="stick-to-bottom button">
                        {isMutatePdfLoading ? (
                            <CircularProgress thickness={3} sx={{ color: 'white' }} />
                        ) : (
                            reportText.title
                        )}
                    </FormSubmitButton>
                </div>
            </div>
        </>
    );
};

export const ExportReport = provide([
    FormProvider<formValues>,
    {
        initialValues: {
            grade: '',
            forWho: ALL_STUDENTS,
            who: '',
            dates: [null, null],
            sendToEmail: '',
        },
        onSubmit: () => {},
        validationSchema: schema,
        className: 'export-form',
        validateOnBlur: true,
    },
])(_ExportReport);
