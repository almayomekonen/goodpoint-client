import ClearIcon from '@mui/icons-material/Clear';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC } from 'react';
import { useI18n } from '../../i18n/mainI18n';
import './preset-message-container.scss';

interface props {
    id: number;
    message: string;
    handleDeletePopupOpen: (id: number, message: string) => void;
}

const PresetMessageContainer: FC<props> = ({ message, id, handleDeletePopupOpen }) => {
    const theme = useTheme();

    const i18n = useI18n((i18n) => ({
        general: i18n.general,
    }));

    return (
        <div className="message-container">
            <div className="message-div">
                <div className="message">
                    <div>
                        {message.split(' ').map((word, index) => {
                            if (word === i18n.general.studentMale) {
                                return (
                                    <b
                                        key={index}
                                        spellCheck={false}
                                        className="coloredStr"
                                    >{`${i18n.general.nameOfMaleStudent} `}</b>
                                );
                            } else if (word === i18n.general.studentFemale) {
                                return (
                                    <b
                                        key={index}
                                        spellCheck={false}
                                        className="coloredStr"
                                    >{`${i18n.general.nameOfFemaleStudent} `}</b>
                                );
                            } else {
                                return <Typography className="word" key={index}>{`${word} `}</Typography>;
                            }
                        })}
                    </div>
                </div>

                <ClearIcon
                    onClick={() => handleDeletePopupOpen(id, message)}
                    sx={{ color: theme.customColors.dark_blue1, cursor: 'pointer' }}
                    fontSize={'medium'}
                />
            </div>
        </div>
    );
};

export default PresetMessageContainer;
