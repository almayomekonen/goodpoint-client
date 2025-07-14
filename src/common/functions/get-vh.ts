/**
 * @param percent  the percentage of the viewport height
 * @returns  the height of the viewport in pixels
 */
export function vh(percent: number) {
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}
