import { ICommand } from '@nestjs/cqrs';
import { ICreateTokenDto } from '../interfaces/token.interface';
export declare class CreateTokenCommand implements ICommand {
    readonly dto: ICreateTokenDto;
    constructor(dto: ICreateTokenDto);
}
