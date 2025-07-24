import { MenuProps } from '@mui/material';
import { FC, PropsWithChildren, createContext, useState } from 'react';

type ContextValue = { menuProps: MenuProps; setAnchorEl: (el: HTMLElement | null) => void };

export const MenuContext = createContext<ContextValue>({
    menuProps: {
        open: false,
        anchorEl: null,
        onClose: () => {},
    },
    setAnchorEl: () => {},
});

/**
 * MenuContext that holds props for UI menu for the top-bars in both desktop app and admin.
 * to prevent duplicity and warps the menu logic.
 * @param {PropsWithChildren} props - The component props.
 * @returns {JSX.Element} The rendered component.
 * @example
 * const { Menu, open, openMenu, closeMenu } = useMenu();
 *
 * <div>
 *   <button onClick={openMenu}>Open Menu</button>
 *   {open && (
 *     <Menu>
 *       <MenuItem onClick={closeMenu}>Option 1</MenuItem>
 *       <MenuItem onClick={closeMenu}>Option 2</MenuItem>
 *       <MenuItem onClick={closeMenu}>Option 3</MenuItem>
 *     </Menu>
 *   )}
 * </div>
 */

export const MenuContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
        <MenuContext.Provider
            value={{
                menuProps: {
                    anchorEl,
                    open: Boolean(anchorEl),
                    onClose: () => setAnchorEl(null),
                },
                setAnchorEl: (el: HTMLElement | null) => {
                    setAnchorEl(el);
                },
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};
