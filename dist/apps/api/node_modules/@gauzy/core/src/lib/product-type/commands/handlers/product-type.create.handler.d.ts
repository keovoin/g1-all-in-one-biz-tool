import { ICommandHandler } from '@nestjs/cqrs';
import { IProductTypeTranslatable } from '@gauzy/contracts';
import { ProductTypeService } from './../../product-type.service';
import { ProductTypeCreateCommand } from '../product-type.create.command';
export declare class ProductTypeCreateHandler implements ICommandHandler<ProductTypeCreateCommand> {
    private readonly productTypeService;
    constructor(productTypeService: ProductTypeService);
    execute(command: ProductTypeCreateCommand): Promise<IProductTypeTranslatable>;
}
