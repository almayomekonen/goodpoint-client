import { AxiosError } from 'axios';

export interface ExcelUploadError extends AxiosError {
    data: {
        message: string;
        errors: Array<string>;
    };
}

export type ExcelUploadResponse = {
    updated: number;
    newRecords: number;
    buffer?: buffer;
};

type buffer = {
    type: string;
    data: ArrayBuffer;
};
