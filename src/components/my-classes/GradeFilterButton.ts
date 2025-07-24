import { styled, ToggleButton } from '@mui/material';

export const GradeFilterButton = styled(ToggleButton)(({ theme }) => ({
    margin: '2px 0.25em', // 2px is for boxShadow (bcos it's not part of the css box-sizing)
    width: 'max-content',
    fontSize: '1.4rem',
    whiteSpace: 'nowrap',
    fontFamily: 'Rubik-medium',

    borderRadius: '24px',
    // border: "none",

    color: theme.customColors.dark_blue1,
    backgroundColor: '#F3F6F7',
    border: `1px solid ${theme.customColors.grey1}`,

    paddingTop: '2px',
    paddingBottom: '2px',
    padding: '7px 20px',

    '&.Mui-selected': {
        '&, &:hover': {
            backgroundColor: theme.customColors.light_blue1,
            color: theme.customColors.dark_blue1,
            border: 'none',
            // boxShadow: `0 0 0 1px white, 0 0 0 2px ${theme.customColors.blue1}`,
        },
    },
}));
