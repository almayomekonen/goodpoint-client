import { RefObject, useEffect } from 'react';

/**
 * Custom hook for detecting clicks outside of a specified container element.
 * @param {RefObject<HTMLElement>} containerRef - Reference to the container element.
 * @param {Function} callback - Callback function to be executed when a click occurs outside the container element.
 */
export function useOutsideClick(containerRef: RefObject<HTMLElement>, callback: (...args: any[]) => any) {
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, true);
        return () => document.addEventListener('click', handleOutsideClick, true);
    }, []);

    function handleOutsideClick(this: Document, e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            callback();
        }
    }
}
