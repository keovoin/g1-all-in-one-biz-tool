import { ICommand } from '@nestjs/cqrs';
import { IProductCreateInput } from '@gauzy/contracts';
export declare class ProductUpdateCommand implements ICommand {
    readonly id: string;
    readonly productUpdateRequest: IProductCreateInput;
    static readonly type = "[Product] Update";
    constructor(id: string, productUpdateRequest: IProductCreateInput);
}
