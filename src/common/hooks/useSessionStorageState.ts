import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Custom hook for managing state that persists in the session storage.
 * @template T - The type of the state value.
 * @param {string} key - The key used for storing the state in the session storage.
 * @returns {[T | null, Updater<T | null>]} - A tuple containing the current state value and a function to update the state.
 */
export function useSessionStorageState<T>(key: string): [T | null, Dispatch<SetStateAction<T | null>>] {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
        //detecting if the state has changed , if so , also update the session storage
        if (state) {
            sessionStorage.setItem(key, JSON.stringify(state));
        }
    }, [state]);

    useEffect(() => {
        try {
            const sessionVar = sessionStorage.getItem(key);
            if (sessionVar) setState(JSON.parse(sessionVar));
        } catch (e) {
            //problem with parsing the json
            return;
        }
    }, []);

    return [state, setState];
}
