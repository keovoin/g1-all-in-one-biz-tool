import { ICommand } from '@nestjs/cqrs';
import { UploadedFile } from '@gauzy/contracts';
import { UploadDocumentsDTO } from '../dto';
export declare class UploadDocumentsCommand implements ICommand {
    readonly input: UploadDocumentsDTO;
    readonly files: UploadedFile[];
    static readonly type = "[Document] Upload";
    constructor(input: UploadDocumentsDTO, files: UploadedFile[]);
}
