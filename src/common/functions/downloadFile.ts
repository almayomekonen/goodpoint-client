import { DEFAULT_FILE_NAME } from '../consts/defultFileName';
/**
 * Initiates the download of a file.
 * @param buffer - The file buffer to be downloaded.
 * @param outputFilename - The desired output filename for the downloaded file.
 */

export function downloadFile(buffer: ArrayBuffer | Blob | null, outputFilename: string | undefined): void {
    if (buffer) {
        let url: string;

        if (buffer instanceof ArrayBuffer && buffer.byteLength > 0) {
            const blob = new Blob([buffer]);
            url = URL.createObjectURL(blob);
        } else if (buffer instanceof Blob && buffer.size > 0) {
            url = URL.createObjectURL(buffer);
        } else {
            return;
        }

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outputFilename ?? DEFAULT_FILE_NAME);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
