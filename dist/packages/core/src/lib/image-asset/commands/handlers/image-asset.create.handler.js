"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageAssetCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const image_asset_create_command_1 = require("../image-asset.create.command");
const image_asset_service_1 = require("../../image-asset.service");
let ImageAssetCreateHandler = class ImageAssetCreateHandler {
    constructor(_imageAssetService) {
        this._imageAssetService = _imageAssetService;
    }
    async execute(command) {
        const { input } = command;
        const asset = await this._imageAssetService.create(input);
        return await this._imageAssetService.findOneByIdString(asset.id);
    }
};
exports.ImageAssetCreateHandler = ImageAssetCreateHandler;
exports.ImageAssetCreateHandler = ImageAssetCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(image_asset_create_command_1.ImageAssetCreateCommand),
    tslib_1.__metadata("design:paramtypes", [image_asset_service_1.ImageAssetService])
], ImageAssetCreateHandler);
//# sourceMappingURL=image-asset.create.handler.js.map