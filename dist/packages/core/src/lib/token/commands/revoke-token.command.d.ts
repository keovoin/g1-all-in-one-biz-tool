import { ICommand } from '@nestjs/cqrs';
import { IRevokeTokenDto } from '../interfaces/token.interface';
export declare class RevokeTokenCommand implements ICommand {
    readonly dto: IRevokeTokenDto;
    constructor(dto: IRevokeTokenDto);
}
