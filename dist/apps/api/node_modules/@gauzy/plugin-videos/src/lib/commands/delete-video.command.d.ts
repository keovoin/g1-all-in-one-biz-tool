import { ICommand } from '@nestjs/cqrs';
import { DeleteVideoDTO } from '../dto';
export declare class DeleteVideoCommand implements ICommand {
    readonly input: DeleteVideoDTO;
    static readonly type = "[Delete] Video";
    constructor(input: DeleteVideoDTO);
}
