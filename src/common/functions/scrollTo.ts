import { RefObject } from 'react';

export const scrollTo = (
    dir: 'top' | 'bottom',
    behavior: 'smooth' | 'auto',
    containerRef?: RefObject<HTMLDivElement>,
) => {
    const target = containerRef?.current ? containerRef.current : window;
    const top = containerRef?.current ? containerRef.current.scrollHeight : document.body.scrollHeight;
    if (dir === 'bottom') target.scrollTo({ top, behavior });
    else if (dir === 'top') target.scrollTo({ top: 0, behavior });
};
