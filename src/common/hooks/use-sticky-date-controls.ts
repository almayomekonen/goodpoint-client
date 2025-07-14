import { useAnimationControls } from 'framer-motion';
import { RefObject, useEffect, useRef } from 'react';
import { isDesktop } from '../functions/isDesktop';

/**
 * Custom hook for managing animation controls for a sticky date element.
 * @param {RefObject<HTMLElement>} containerRef - Reference to the container element.
 * @param {any[]} useEffectParams - Optional array of dependencies for the useEffect hook.
 * @returns {AnimationControls} - Animation controls for managing the sticky date element animation.
 */
export function useStickyDateControls(containerRef: RefObject<HTMLElement>, useEffectParams: any[] = []) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInDesktop = isDesktop();
    const animationControls = useAnimationControls();

    //function to handle the scroll event, changing the sticky date position and hiding it after 2 seconds
    function handleScroll() {
        animationControls.start({ top: '1%', transition: { duration: 0 } });
        if (timeoutRef.current) clearTimeout(timeoutRef.current); //clearing the current running timeout
        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            animationControls.start({
                top: isInDesktop ? '-20%' : '-25%',
                transition: { duration: 0.7, ease: 'linear' },
            });
        }, 1500);
    }

    useEffect(() => {
        //listener on scroll to make the sticky date on top disappear after 2 seconds and reappear when scrolling again
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => {
            containerRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [useEffectParams]);

    useEffect(() => {
        //makes sure the sticky date is hidden when switching between teachers and students gps
        handleScroll();
    }, useEffectParams);

    return animationControls;
}
