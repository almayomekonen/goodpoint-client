import { useAnimationControls } from 'framer-motion';
import { RefObject, useEffect, useRef } from 'react';
import { isDesktop } from '../functions/isDesktop';

export function useStickyDateControls(containerRef: RefObject<HTMLElement>, useEffectParams: any[] = []) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInDesktop = isDesktop();
    const animationControls = useAnimationControls();

    useEffect(() => {
        function handleScroll() {
            animationControls.start({ top: '1%', transition: { duration: 0 } });

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null;
                animationControls.start({
                    top: isInDesktop ? '-20%' : '-25%',
                    transition: { duration: 0.7, ease: 'linear' },
                });
            }, 1500);
        }

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [animationControls, isInDesktop, containerRef, ...useEffectParams]);

    return animationControls;
}
