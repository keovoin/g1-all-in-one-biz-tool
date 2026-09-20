import { CreateCamshotDTO } from "../dtos/create-camshot.dto";
import { ICommand } from '@nestjs/cqrs';
import { FileDTO } from "../dtos/file.dto";
export declare class CreateCamshotCommand implements ICommand {
    readonly input: CreateCamshotDTO;
    readonly file: FileDTO;
    static readonly type = "[Camshot] Create";
    constructor(input: CreateCamshotDTO, file: FileDTO);
}
