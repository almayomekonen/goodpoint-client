export function fadeIn(element: HTMLElement) {
    element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        easing: 'ease-in-out',
    });
}
