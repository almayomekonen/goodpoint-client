import { useEffect, useRef, useState } from 'react';
import { isDesktop } from '../functions/isDesktop';

/**
 * Used for re-rendering app when isDesktop function returns new value.
 */
export const useWindowResize = () => {
    const isInDesktop = useRef(isDesktop());
    // eslint-disable-next-line no-unused-vars
    const [, setState] = useState(1);

    const onResize = () => {
        if (isInDesktop.current !== isDesktop()) {
            isInDesktop.current = !isInDesktop.current;
            setState((state) => state + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
};
