import { CrudController } from '../core/crud';
import { ProductVariantSetting } from './product-setting.entity';
import { ProductVariantSettingService } from './product-setting.service';
export declare class ProductVariantSettingController extends CrudController<ProductVariantSetting> {
    readonly productVariantSettingService: ProductVariantSettingService;
    constructor(productVariantSettingService: ProductVariantSettingService);
}
