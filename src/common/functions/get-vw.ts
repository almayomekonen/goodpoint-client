/**
 *
 * @param percent the percentage of the viewport width
 * @returns  the width of the viewport in pixels
 */

export function vw(percent: number) {
    const h = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * h) / 100;
}
