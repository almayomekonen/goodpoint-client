import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

/**
 *
 * @param onLongPress function to be called when long press is detected
 * @returns the state of the long press, and the handlers to be used on the element
 */
export function useOnLongPress(onLongPress: () => void, containerRef: React.RefObject<HTMLElement>) {
    const [didLongPress, setDidLongPress] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    function onTouchEnd() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    function onTouchStart() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setDidLongPress(true);
            onLongPress();
        }, 1000);
        //closing the state after 2 seconds
        setTimeout(() => setDidLongPress(false), 2000);
    }

    //only set didLongPress if user isn't scrolling
    useEffect(() => {
        function handleScroll() {
            //clean the timeout
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            //reset the state
            setDidLongPress(false);
        }
        containerRef.current?.addEventListener('scroll', handleScroll);
        return () => containerRef.current?.removeEventListener('scroll', handleScroll);
    }, []);

    return {
        didLongPress,
        onTouchEnd,
        onTouchStart,
    };
}
