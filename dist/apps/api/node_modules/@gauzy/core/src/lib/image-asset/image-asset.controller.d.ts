import { CommandBus } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { IImageAsset, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { ImageAsset } from './image-asset.entity';
import { ImageAssetService } from './image-asset.service';
import { UploadImageAsset } from './dto';
export declare class ImageAssetController extends CrudController<ImageAsset> {
    private readonly _commandBus;
    private readonly _imageAssetService;
    private readonly logger;
    constructor(_commandBus: CommandBus, _imageAssetService: ImageAssetService);
    /**
     * Upload image asset on specific tenant file storage
     *
     * @param entity
     * @returns
     */
    upload(file: any, headers: Record<string, string>, entity: UploadImageAsset): Promise<any>;
    /**
     * GET image assets counts
     *
     * @param filter
     * @returns
     */
    getCount(options: FindOptionsWhere<ImageAsset>): Promise<number>;
    /**
     * GET image assets by pagination
     *
     * @param filter
     * @returns
     */
    pagination(params: BaseQueryDTO<ImageAsset>): Promise<IPagination<IImageAsset>>;
    /**
     * GET image assets
     *
     * @param data
     * @returns
     */
    findAll(params: BaseQueryDTO<ImageAsset>): Promise<IPagination<IImageAsset>>;
    /**
     * GET image assets by id
     *
     * @param id
     * @returns
     */
    findById(id: IImageAsset['id']): Promise<IImageAsset>;
    /**
     * CREATE new image asset
     *
     * @param entity
     * @returns
     */
    create(entity: ImageAsset): Promise<IImageAsset>;
    /**
     * DELETE image assets
     *
     * @param id
     * @returns
     */
    delete(id: IImageAsset['id']): Promise<any>;
}
