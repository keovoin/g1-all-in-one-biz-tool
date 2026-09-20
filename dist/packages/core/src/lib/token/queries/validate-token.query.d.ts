import { IQuery } from '@nestjs/cqrs';
import { IValidateTokenDto } from '../interfaces/token.interface';
export declare class ValidateTokenQuery implements IQuery {
    readonly dto: IValidateTokenDto;
    constructor(dto: IValidateTokenDto);
}
