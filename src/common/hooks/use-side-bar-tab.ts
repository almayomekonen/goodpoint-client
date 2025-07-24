import React, { SyntheticEvent, useEffect } from 'react';
import { validPaths } from '../consts/sideBarPaths.consts';
import { useLocation } from 'react-router-dom';

/**
 *
 * @param selectedTabRef the ref of the selected tab
 * @param setAnimationFinished sets the animation finished state
 * @returns
 */
export function useSideBarTab(
    selectedTabRef: React.RefObject<HTMLButtonElement>,
    setAnimationFinished: React.Dispatch<React.SetStateAction<boolean>>,
) {
    const [currentTabPos, setCurrentTabPos] = React.useState<undefined | number>(undefined);
    const { pathname: currentPath } = useLocation();
    //effects

    //handles the resize of the window
    useEffect(() => {
        window.addEventListener('resize', handleResize, false);
        return () => {
            window.removeEventListener('resize', handleResize, true);
        };
    }, []);

    //handles the animation of the tabs when the path changes
    useEffect(() => {
        if (selectedTabRef.current) {
            const scrollHeight = document.querySelector('.desktop-side-bar-container')?.scrollTop || 0;
            animateMoveToTab(selectedTabRef.current.getBoundingClientRect().top - getTopBarHeight() + scrollHeight);
        }
    }, [selectedTabRef.current, currentPath]);

    //functions
    function handleResize() {
        if (selectedTabRef.current) {
            animateMoveToTab(selectedTabRef.current.getBoundingClientRect().top - getTopBarHeight());
        }
    }

    // calculate the height of the top bar - needed for the animation of the tabs.
    function getTopBarHeight() {
        return document.querySelector('.desktop-top-bar-container')?.getBoundingClientRect().height || 0;
    }

    function handleTabAnimation(e: SyntheticEvent, pathName: string) {
        if (currentPath !== pathName) {
            const scrollHeight = document.querySelector('.desktop-side-bar-container')?.scrollTop || 0;
            animateMoveToTab(e.currentTarget?.getBoundingClientRect().top - getTopBarHeight() + scrollHeight);
        }
    }

    function animateMoveToTab(top: number) {
        if (validPaths.some((path) => path == currentPath)) {
            setAnimationFinished(false);
            setTimeout(() => {
                setAnimationFinished(true);
            }, 300);
        } else setAnimationFinished(true);
        setCurrentTabPos(top);
    }

    return [currentTabPos, handleTabAnimation] as const;
}
