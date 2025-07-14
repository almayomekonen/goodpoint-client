import { FC, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';
import './toggleAdminTabs.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface ToggleAdminTabs {
    tabOneText: string;
    tabTwoText: string;
    firstTabPath: string;
    secondTabPath: string;
}

/**
 * ToggleAdminTabs is a specific component that displays toggleable tabs for navigating between two paths.
 * @component
 * @param {string} tabOneText - The text to display for the first tab.
 * @param {string} tabTwoText - The text to display for the second tab.
 * @param {string} firstTabPath - The path for the first tab.
 * @param {string} secondTabPath - The path for the second tab.
 * @returns {JSX.Element} A React element representing the ToggleAdminTabs component.
 */

const ToggleAdminTabs: FC<ToggleAdminTabs> = ({ tabOneText, tabTwoText, firstTabPath, secondTabPath }) => {
    const tabOneRef = useRef<HTMLButtonElement>(null);
    const tabTwoRef = useRef<HTMLButtonElement>(null);

    const [currentTabDetails, setCurrentTabDetails] = useState<{
        width: number | undefined;
        left: number | undefined;
    }>();

    const navigate = useNavigate();
    const location = useLocation();

    const arePathsMatch = (path: string) => location.pathname === path;

    useEffect(() => {
        const updateCurrentTabDetails = () => {
            const activeTabRef = arePathsMatch(firstTabPath)
                ? tabOneRef.current
                : arePathsMatch(secondTabPath)
                  ? tabTwoRef.current
                  : null;
            if (activeTabRef) {
                const { width, left } = activeTabRef.getBoundingClientRect();
                setCurrentTabDetails({ width, left });
            }
        };
        updateCurrentTabDetails();
        window.addEventListener('resize', updateCurrentTabDetails);
        return () => {
            window.removeEventListener('resize', updateCurrentTabDetails);
        };
    }, [location.pathname]);

    const handleTabOneClick = () => {
        navigate(firstTabPath, { replace: true });
    };

    const handleTabTwoClick = () => {
        navigate(secondTabPath, { replace: true });
    };

    return (
        <>
            <div className="toggle-admin-tabs-container">
                <div className="toggle-area">
                    <div className="tabs">
                        <button
                            type="button"
                            ref={tabOneRef}
                            onClick={handleTabOneClick}
                            className={clsx(arePathsMatch(firstTabPath) && 'chosen', 'tab')}
                        >
                            {tabOneText}
                        </button>
                        <button
                            type="button"
                            ref={tabTwoRef}
                            onClick={handleTabTwoClick}
                            className={clsx(arePathsMatch(secondTabPath) && 'chosen', 'tab')}
                        >
                            {tabTwoText}
                        </button>
                    </div>

                    <div className="bottom-bar">
                        <Box
                            className="colored-bottom"
                            width={currentTabDetails?.width}
                            right={currentTabDetails?.left}
                        />
                    </div>
                </div>

                <Outlet />
            </div>
        </>
    );
};

export default ToggleAdminTabs;
