"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAssetService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const context_1 = require("./../core/context");
const crud_1 = require("./../core/crud");
const mikro_orm_image_asset_repository_1 = require("./repository/mikro-orm-image-asset.repository");
const type_orm_image_asset_repository_1 = require("./repository/type-orm-image-asset.repository");
let ImageAssetService = class ImageAssetService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmImageAssetRepository, mikroOrmImageAssetRepository) {
        super(typeOrmImageAssetRepository, mikroOrmImageAssetRepository);
    }
    /**
     * Create image asset
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        const user = context_1.RequestContext.currentUser();
        try {
            return await super.create(entity);
        }
        catch (error) {
            console.log(`Error while creating image assets for user (${user.name})`, error);
            throw new common_1.BadRequestException(error);
        }
    }
    async deleteAsset(imageId) {
        const result = await this.findOneByIdString(imageId, {
            relations: {
                productGallery: true,
                productFeaturedImage: true
            }
        });
        if (!result) {
            throw new common_1.HttpException('Image asset not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (result.productGallery?.length || result.productFeaturedImage?.length) {
            throw new common_1.HttpException('Image is under use', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.delete(imageId);
        return result;
    }
};
exports.ImageAssetService = ImageAssetService;
exports.ImageAssetService = ImageAssetService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_image_asset_repository_1.TypeOrmImageAssetRepository,
        mikro_orm_image_asset_repository_1.MikroOrmImageAssetRepository])
], ImageAssetService);
//# sourceMappingURL=image-asset.service.js.map