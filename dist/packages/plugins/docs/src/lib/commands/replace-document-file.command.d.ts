import { ICommand } from '@nestjs/cqrs';
import { ID, UploadedFile } from '@gauzy/contracts';
import { ReplaceDocumentFileDTO } from '../dto';
export declare class ReplaceDocumentFileCommand implements ICommand {
    readonly id: ID;
    readonly input: ReplaceDocumentFileDTO;
    readonly file: UploadedFile;
    static readonly type = "[Document] Replace File";
    constructor(id: ID, input: ReplaceDocumentFileDTO, file: UploadedFile);
}
