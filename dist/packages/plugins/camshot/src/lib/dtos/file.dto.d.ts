import { UploadedFile } from '@gauzy/contracts';
export declare class FileDTO implements UploadedFile {
    fieldname: string;
    key: string;
    originalname: string;
    size: number;
    encoding?: string;
    mimetype?: string;
    filename: string;
    url: string;
    path: string;
}
