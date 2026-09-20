import { CreateSoundshotDTO } from "../dtos/create-soundshot.dto";
import { ICommand } from '@nestjs/cqrs';
import { FileDTO } from "../dtos/file.dto";
export declare class CreateSoundshotCommand implements ICommand {
    readonly input: CreateSoundshotDTO;
    readonly file: FileDTO;
    static readonly type = "[Soundshot] Create";
    constructor(input: CreateSoundshotDTO, file: FileDTO);
}
