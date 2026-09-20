import { ICommand } from '@nestjs/cqrs';
import { IProductCreateInput } from '@gauzy/contracts';
export declare class ProductCreateCommand implements ICommand {
    readonly productInput: IProductCreateInput;
    static readonly type = "[Product] Register";
    constructor(productInput: IProductCreateInput);
}
