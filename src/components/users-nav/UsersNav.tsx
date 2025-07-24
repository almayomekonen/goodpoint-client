import { FC } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { Typography } from '@mui/material';
import { GroupMessageReceiver } from '../../common/types/group-message-receiver.type';
import { useDirection } from '../../i18n/mainI18n';
import './users-nav.scss';

interface props {
    students: GroupMessageReceiver[];
    removeReceiver: (id: number) => void;
}
export const UsersNav: FC<props> = ({ students, removeReceiver }) => {
    //direction of text based on language
    const dir = useDirection();

    return (
        <div style={{ direction: dir }} className="users-nav">
            {students.map((std) => {
                return (
                    <div key={std.id} className="user-nav-box">
                        <Typography className="user-nav-text">
                            {std.firstName ? std.firstName : ''} {std.lastName ? std.lastName : ''}
                        </Typography>
                        <button onClick={() => removeReceiver(std.id)} className="remove-receiver-button">
                            <ClearIcon className="clear-user-icon" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
