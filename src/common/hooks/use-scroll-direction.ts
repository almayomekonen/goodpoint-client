import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';
type ScrollDir = 'up' | 'down';

/**
 * Custom hook for detecting the scroll direction of a container or the window.
 * @typedef {('up' | 'down')} ScrollDir - The type for specifying the scroll direction ('up' or 'down').
 * @param {RefObject<HTMLDivElement>?} containerRef - Optional reference to the container element for detecting scroll direction.
 * @returns {[ScrollDir, Dispatch<SetStateAction<ScrollDir>>]} - A tuple containing the current scroll direction and a function to update the scroll direction.
 */
export const useScrollDirection = (
    containerRef?: RefObject<HTMLDivElement>,
): [ScrollDir, Dispatch<SetStateAction<ScrollDir>>] => {
    const [scrollDir, setScrollDir] = useState<ScrollDir>('up');
    const y = useRef(containerRef?.current ? containerRef.current.scrollTop : window.scrollY);
    const currentDir = useRef<ScrollDir>(scrollDir);

    const handleNavigation = (e: any) => {
        const window = e.currentTarget;
        const currentY = containerRef?.current ? containerRef.current.scrollTop : window.scrollY;
        if (y.current > currentY && currentDir.current != 'up') {
            setScrollDir('up');
            currentDir.current = 'up';
        } else if (y.current < currentY && currentDir.current != 'down') {
            setScrollDir('down');
            currentDir.current = 'down';
        }
        y.current = currentY;
    };

    useEffect(() => {
        y.current = containerRef?.current ? containerRef.current.scrollTop : window.scrollY;
        const target = containerRef?.current ? containerRef.current : window;
        target.addEventListener('scroll', handleNavigation);
        return () => {
            target.removeEventListener('scroll', handleNavigation);
        };
    }, [handleNavigation]);

    return [scrollDir, setScrollDir];
};
