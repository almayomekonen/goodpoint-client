import { createContext, FC, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

const KeyboardOpenContext = createContext<boolean>(false);

export const KeyboardOpenProvider: FC<PropsWithChildren> = ({ children }) => {
    const [realKeyboard, setRealKeyboard] = useState(false);
    const lastScreenSize = useRef(window.innerHeight);

    function resize(event: any) {
        if (lastScreenSize.current < event.target.height) setRealKeyboard(false);
        else setRealKeyboard(true);
        lastScreenSize.current = event.target.height;
    }

    useEffect(() => {
        window.visualViewport?.addEventListener('resize', resize);

        return () => window.visualViewport?.removeEventListener('resize', resize);
    }, []);

    return <KeyboardOpenContext.Provider value={realKeyboard}>{children}</KeyboardOpenContext.Provider>;
};

export const useKeyboardOpen = () => useContext(KeyboardOpenContext);
