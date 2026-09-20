"use strict";
var ImageAssetController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAssetController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const uuid_1 = require("uuid");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const file_storage_1 = require("./../core/file-storage");
const interceptors_1 = require("./../core/interceptors");
const context_1 = require("./../core/context");
const utils_1 = require("./../core/utils");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
const image_asset_entity_1 = require("./image-asset.entity");
const image_asset_service_1 = require("./image-asset.service");
const dto_1 = require("./dto");
let ImageAssetController = ImageAssetController_1 = class ImageAssetController extends crud_1.CrudController {
    constructor(_commandBus, _imageAssetService) {
        super(_imageAssetService);
        this._commandBus = _commandBus;
        this._imageAssetService = _imageAssetService;
        this.logger = new common_1.Logger(ImageAssetController_1.name);
    }
    /**
     * Upload image asset on specific tenant file storage
     *
     * @param entity
     * @returns
     */
    async upload(file, headers, entity) {
        const provider = new file_storage_1.FileStorage().getProvider();
        let thumbnail;
        // Content-based validation: the multer fileFilter only inspects the client-controlled MIME type
        // and filename, which can be spoofed. Re-check the actual stored bytes and reject markup
        // (SVG/XML/HTML/XHTML) that would execute as stored XSS when served from `/public/<key>`
        // (GHSA-p334-cm7f-php5). The file is deleted on rejection because `/public` serves directly from
        // disk regardless of whether the DB asset record is ever created.
        const fileContent = await provider.getFile(file.key);
        try {
            (0, file_storage_1.assertNotMarkupContent)(fileContent);
        }
        catch (error) {
            try {
                await provider.deleteFile(file.key);
            }
            catch {
                this.logger.error('Error while deleting rejected upload from file storage provider');
            }
            throw error;
        }
        try {
            const inputFile = await (0, utils_1.tempFile)('media-asset-thumb');
            const outputFile = await (0, utils_1.tempFile)('media-asset-thumb');
            await fs.promises.writeFile(inputFile, fileContent);
            const image = await Jimp.read(inputFile);
            // we are using Jimp.AUTO for height instead of hardcode (e.g. 150px)
            image.resize(250, Jimp.AUTO);
            await image.writeAsync(outputFile);
            const data = await fs.promises.readFile(outputFile);
            try {
                await fs.promises.unlink(inputFile);
                await fs.promises.unlink(outputFile);
            }
            catch (error) {
                this.logger.error('Error while unlinking temp files');
            }
            const thumbName = `thumb-${file.filename}`;
            const thumbDir = path.dirname(file.key);
            // Replace double backslashes with single forward slashes
            const fullPath = path.join(thumbDir, thumbName).replace(/\\/g, '/');
            thumbnail = await provider.putFile(data, fullPath);
        }
        catch (error) {
            this.logger.error('Error while uploading media asset into file storage provider');
        }
        // Extract tenant and organization IDs from request headers and body
        const tenantId = headers['tenant-id'] || entity?.tenantId;
        const organizationId = headers['organization-id'] || entity?.organizationId;
        return await this._commandBus.execute(new commands_1.ImageAssetCreateCommand({
            ...entity,
            tenantId,
            organizationId,
            name: file.filename,
            url: file.key,
            thumb: thumbnail ? thumbnail.key : null,
            size: file.size,
            storageProvider: provider.name
        }));
    }
    /**
     * GET image assets counts
     *
     * @param filter
     * @returns
     */
    async getCount(options) {
        return await this._imageAssetService.countBy(options);
    }
    /**
     * GET image assets by pagination
     *
     * @param filter
     * @returns
     */
    async pagination(params) {
        return await this._imageAssetService.paginate(params);
    }
    /**
     * GET image assets
     *
     * @param data
     * @returns
     */
    async findAll(params) {
        return await this._imageAssetService.findAll(params);
    }
    /**
     * GET image assets by id
     *
     * @param id
     * @returns
     */
    async findById(id) {
        return await this._imageAssetService.findOneByIdString(id);
    }
    /**
     * CREATE new image asset
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this._imageAssetService.create(entity);
    }
    /**
     * DELETE image assets
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await this._imageAssetService.deleteAsset(id);
    }
};
exports.ImageAssetController = ImageAssetController;
tslib_1.__decorate([
    (0, common_1.Post)('upload/:folder'),
    (0, common_1.UseInterceptors)((0, interceptors_1.LazyFileInterceptor)('file', {
        storage: (ctx) => {
            const request = ctx.switchToHttp().getRequest();
            // Sanitize folder name: strip path traversal characters, allow only alphanumeric/dash/underscore
            const rawFolder = request?.params?.folder || 'image_assets';
            const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'image_assets';
            // Define the base directory for storing media
            const baseDirectory = path.join('uploads', folder);
            // Generate unique sub directories based on the current tenant
            const subDirectory = path.join(context_1.RequestContext.currentTenantId() || (0, uuid_1.v4)());
            return new file_storage_1.FileStorage().storage({
                dest: () => path.join(baseDirectory, subDirectory)
            });
        },
        // Only accept raster images. SVG (and other markup/active-content files) are rejected because
        // uploads are served unauthenticated from `/public/<key>` and an SVG can carry executable
        // JavaScript, leading to stored XSS (GHSA-p334-cm7f-php5).
        fileFilter: file_storage_1.imageUploadFileFilter
    })),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, file_storage_1.UploadedFileStorage)()),
    tslib_1.__param(1, (0, common_1.Headers)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, dto_1.UploadImageAsset]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "upload", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all image assets counts in the same tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found image assets count'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW),
    (0, common_1.Get)('count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all image assets in the same tenant using pagination.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found image assets in the tenant',
        type: image_asset_entity_1.ImageAsset
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.MEDIA_GALLERY_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "findById", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [image_asset_entity_1.ImageAsset]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.MEDIA_GALLERY_DELETE),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImageAssetController.prototype, "delete", null);
exports.ImageAssetController = ImageAssetController = ImageAssetController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ImageAsset'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.MEDIA_GALLERY_ADD),
    (0, common_1.Controller)('/image-assets'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, image_asset_service_1.ImageAssetService])
], ImageAssetController);
//# sourceMappingURL=image-asset.controller.js.map