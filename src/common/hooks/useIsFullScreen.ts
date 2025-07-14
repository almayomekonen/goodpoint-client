import { useEffect, useState } from 'react';

/**
 * Custom hook for detecting whether the application is in full-screen mode. used in mobile to detected whether the url is showing
 * @returns {boolean} isInFullScreen - Indicates whether the application is in full-screen mode.
 */
export function useIsFullScreen() {
    const [isInFullScreen, setIsInFullScreen] = useState(true);

    function isFullScreen() {
        if (window.innerHeight === window.document.body.clientHeight) setIsInFullScreen(true);
        else setIsInFullScreen(false);
    }
    useEffect(() => {
        isFullScreen();
        window.addEventListener('resize', isFullScreen);
        return () => window.removeEventListener('resize', isFullScreen);
    }, [window.innerHeight]);

    return isInFullScreen;
}
