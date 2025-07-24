import React, { useCallback, useContext } from 'react';

import { MenuContext } from '../contexts/MenuContext';

import MuiMenu, { MenuProps } from '@mui/material/Menu';

const Menu: React.FC<Omit<MenuProps, 'open' | 'anchorEl' | 'onClose'>> = (props) => {
    const { menuProps } = useContext(MenuContext);
    return <MuiMenu {...menuProps} {...props} />;
};

export const useMenu = () => {
    const { menuProps, setAnchorEl } = useContext(MenuContext);

    const openMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            const target = event.currentTarget;
            setAnchorEl(target);
        },
        [setAnchorEl],
    );

    const closeMenu = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchorEl(null);
        },
        [setAnchorEl],
    );

    return {
        Menu,
        open: menuProps.open,
        openMenu,
        closeMenu,
    };
};
