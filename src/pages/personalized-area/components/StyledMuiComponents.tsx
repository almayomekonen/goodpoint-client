// import styled from "styled-components";
import { styled } from '@mui/system';

import CloseIcon from '@mui/icons-material/Close';
import { FormSwitch } from '@hilma/forms';

export const AntSwitch = styled(FormSwitch)(() => ({
    width: 50,
    height: 30,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            backgroundColor: '#9FA7BF',
            width: 23,
            height: 23,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(18px)',
            backgroundColor: '#9FA7BF',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 4,
        '&.Mui-checked': {
            transform: 'translateX(18px)',
            color: '#081D5A',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#9FA7BF',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 23,
        height: 23,
        borderRadius: 12,
        transition: '0.3s',
    },
    '& .MuiSwitch-track': {
        borderRadius: 30 / 2,
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

export const BiggerCloseIcon = styled(CloseIcon)({
    fontSize: '3rem',
});
