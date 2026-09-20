import { ICommand } from '@nestjs/cqrs';
import { CreateVideoDTO } from '../dto';
export declare class CreateVideoCommand implements ICommand {
    readonly input: CreateVideoDTO;
    static readonly type = "[Create] Video";
    constructor(input: CreateVideoDTO);
}
