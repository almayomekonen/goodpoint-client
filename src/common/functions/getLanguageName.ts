/**
 * @param code - a string parm representing the language needed
 * @returns The function returns the name of a language based on its code, using the Intl.DisplayNames API.
 */
export const getLanguageName = (code: string) => {
    const lang = new Intl.DisplayNames([code], { type: 'language' });
    return lang.of(code);
};
