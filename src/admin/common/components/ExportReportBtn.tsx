import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import { useI18n } from '../../../i18n/mainI18n';
import ExportPopUp from '../../components/export-report-pop-up/ExportPopUp';
import Button from '@mui/material/Button';
import './exportReportBtn.scss';
import { FC } from 'react';

interface ExportReportBtnProps {
    title: string;
    queryPath: string;
    contentQuery: object;
    filename: string;
    disabledBtn: boolean;
}

/**
ExportReportBtn component it is a generic component for exporting a report.
@param {string} title - The text that will appear on the button and the title of the popup.
@param {string} queryPath - The address of the POST request to the server.
@param {object} contentQuery - The information that will be sent to the server in the body. No need to send dates!
@param {string} filename - The name of the downloaded file.
@param {boolean} disabledBtn - Is the button possible (recommend not enabling it when there is no data to export).

*/
const ExportReportBtn: FC<ExportReportBtnProps> = ({ queryPath, contentQuery, title, filename, disabledBtn }) => {
    const { closePopup, openPopup } = usePopup();

    const { reportText } = useI18n((i18n) => {
        return {
            reportText: i18n.reportText,
        };
    });

    return (
        <Button
            className="export-report-button"
            variant="contained"
            disabled={disabledBtn}
            color="secondary"
            onClick={async () => {
                openPopup(popupType.REGULAR, {
                    title,
                    content: (
                        <ExportPopUp
                            labelText={reportText.labels.dates}
                            closePopup={closePopup}
                            queryPath={queryPath}
                            contentQuery={contentQuery}
                            filename={filename}
                        />
                    ),
                });
            }}
        >
            {title}
        </Button>
    );
};
export default ExportReportBtn;
