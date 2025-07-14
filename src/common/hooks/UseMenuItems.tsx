import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '../../admin/common/functions/useIsAdmin';
import { MenuSidebarText } from '../../i18n/texts';
import { useAppLogout } from './useAppLogout';

type MenuObjType = {
    text: MenuSidebarText;
    icon: ReactElement;
    pathName: string;
    onClick: () => void;
};
type MobileOrDesktop = 'Mobile' | 'Desktop';

/**
 * Custom hook for generating menu items based for the side bar on the display type.
 * @typedef {("Mobile" | "Desktop")} MobileOrDesktop - The type for specifying the display type.
 * @returns {MenuObjType[]} - An array of menu items.
 */
export const useMenuItems = (display: MobileOrDesktop) => {
    const navigate = useNavigate();
    const logout = useAppLogout();
    const isAdmin = useIsAdmin('ADMIN');

    const MobileMenuObj: MenuObjType[] = [
        {
            text: 'receivedGp',
            icon: <MarkChatUnreadIcon className="menu-icon" />,
            pathName: '/received-good-points',
            onClick: () => navigate('/received-good-points'),
        },
        {
            text: 'pointsIGave',
            icon: <FavoriteIcon className="menu-icon" />,
            pathName: '/teacher-activity',
            onClick: () => navigate('/teacher-activity'),
        },
        {
            text: 'exportReport',
            icon: <PrintIcon className="menu-icon" />,
            pathName: '/export-report',
            onClick: () => navigate('/export-report'),
        },
        {
            text: 'privetZone',
            icon: <PersonIcon className="menu-icon" />,
            pathName: '/personalized-area',
            onClick: () => navigate('/personalized-area'),
        },
        {
            text: 'presetMessagesBank',
            icon: <CommentIcon className="menu-icon" />,
            pathName: '/preset-messages',
            onClick: () => navigate('/preset-messages'),
        },
    ];

    if (isAdmin && display === 'Desktop') {
        MobileMenuObj.push({
            text: 'admin',
            icon: <ManageAccountsIcon className="menu-icon" />,
            pathName: '/admin',
            onClick: () => navigate('/admin'),
        });
    }

    MobileMenuObj.push({
        text: 'logout',
        icon: <LogoutIcon className="menu-icon" />,
        pathName: 'logout',
        onClick: logout,
    });

    const DesktopMenuObj: MenuObjType[] = [
        {
            text: 'home',
            icon: <HomeIcon className="menu-icon" />,
            pathName: '/',
            onClick: () => navigate('/'),
        },
        ...MobileMenuObj.filter((item) => item.text != 'privetZone'),
    ];
    return display === 'Desktop' ? DesktopMenuObj : MobileMenuObj;
};
