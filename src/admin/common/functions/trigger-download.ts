export function triggerDownload(url: string) {
    const link = document.createElement('a');
    const linkUrl = window.origin.replace(':3000', ':8080') + url;
    link.setAttribute('href', linkUrl);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
