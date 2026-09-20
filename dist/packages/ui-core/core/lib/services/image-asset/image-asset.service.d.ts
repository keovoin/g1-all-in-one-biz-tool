import { HttpClient } from '@angular/common/http';
import { IImageAsset, IImageAssetFindInput, IPagination } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class ImageAssetService extends CrudService<IImageAsset> {
    static readonly API_URL = "/api/image-assets";
    constructor(http: HttpClient);
    createImageAsset(imageAsset: IImageAsset): Promise<IImageAsset>;
    getAll(where?: IImageAssetFindInput): Promise<IPagination<IImageAsset>>;
    deleteImageAsset(imageAsset: IImageAsset): Promise<IImageAsset>;
    updateImageAsset(imageAsset: IImageAsset): Promise<IImageAsset>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageAssetService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ImageAssetService>;
}
