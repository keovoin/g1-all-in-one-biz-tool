import { ICommand } from '@nestjs/cqrs';
import { IRotateTokenDto } from '../interfaces/token.interface';
export declare class RotateTokenCommand implements ICommand {
    readonly dto: IRotateTokenDto;
    constructor(dto: IRotateTokenDto);
}
