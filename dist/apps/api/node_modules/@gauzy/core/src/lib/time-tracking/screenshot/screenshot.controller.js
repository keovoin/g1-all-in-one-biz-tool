"use strict";
var ScreenshotController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const contracts_1 = require("@gauzy/contracts");
const event_bus_1 = require("../../event-bus/event-bus");
const screenshot_event_1 = require("../../event-bus/events/screenshot.event");
const base_entity_event_1 = require("../../event-bus/base-entity-event");
const context_1 = require("./../../core/context");
const file_storage_1 = require("../../core/file-storage");
const utils_1 = require("../../core/utils");
const interceptors_1 = require("./../../core/interceptors");
const decorators_1 = require("./../../shared/decorators");
const guards_1 = require("./../../shared/guards");
const pipes_1 = require("./../../shared/pipes");
const delete_screenshot_dto_1 = require("./dto/delete-screenshot.dto");
const screenshot_entity_1 = require("./screenshot.entity");
const screenshot_service_1 = require("./screenshot.service");
let ScreenshotController = ScreenshotController_1 = class ScreenshotController {
    constructor(_screenshotService, _eventBus) {
        this._screenshotService = _screenshotService;
        this._eventBus = _eventBus;
        this.logger = new common_1.Logger(ScreenshotController_1.name);
        this.logging = true;
    }
    /**
     * Capture a start/stop screenshot
     *
     * @param input The screenshot input data.
     * @param file The uploaded file data.
     * @returns The created screenshot entity.
     */
    async create(input, file) {
        if (!file.key) {
            this.logger.warn('Screenshot file key is empty');
            return;
        }
        if (this.logging)
            this.logger.log('Screenshot request received');
        // Extract user information from the request context
        const user = context_1.RequestContext.currentUser();
        // Extract necessary properties from the request body
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        const organizationId = input.organizationId;
        const userId = context_1.RequestContext.currentUserId();
        // Initialize file storage provider and process thumbnail
        const provider = new file_storage_1.FileStorage().getProvider();
        // Retrieve file content from the file storage provider
        const fileContent = await provider.getFile(file.key);
        // Content-based validation: the multer fileFilter only inspects the client-controlled MIME type
        // and filename, which can be spoofed. Re-check the actual stored bytes and reject markup that
        // would execute as stored XSS when served from `/public/<key>` (GHSA-p334-cm7f-php5). This runs
        // OUTSIDE the try/catch below, which swallows errors — a rejection must reach the client.
        // The file is deleted because `/public` serves from disk whether or not a DB record is created.
        try {
            (0, file_storage_1.assertNotMarkupContent)(fileContent);
        }
        catch (error) {
            try {
                await provider.deleteFile(file.key);
            }
            catch {
                this.logger.error('Error while deleting rejected screenshot from file storage provider');
            }
            throw error;
        }
        try {
            // Create temporary files for input and output of thumbnail processing
            const inputFile = await (0, utils_1.tempFile)('screenshot-thumb');
            const outputFile = await (0, utils_1.tempFile)('screenshot-thumb');
            // Write the file content to the input temporary file
            await fs.promises.writeFile(inputFile, fileContent);
            // Resize the image using Jimp library
            const image = await Jimp.read(inputFile);
            // we are using Jimp.AUTO for height instead of hardcode (e.g. 150px)
            image.resize(250, Jimp.AUTO);
            // Write the resized image to the output temporary file
            await image.writeAsync(outputFile);
            // Read the resized image data from the output temporary file
            const data = await fs.promises.readFile(outputFile);
            try {
                // Remove the temporary input and output files
                await fs.promises.unlink(inputFile);
                await fs.promises.unlink(outputFile);
            }
            catch (error) {
                this.logger.error('Error while unlinking temp files');
            }
            // Define thumbnail file name and directory
            const thumbName = `thumb-${file.filename}`;
            const thumbDir = path.dirname(file.key);
            // Replace double backslashes with single forward slashes
            const fullPath = path.join(thumbDir, thumbName).replace(/\\/g, '/');
            // Upload the thumbnail data to the file storage provider
            const thumb = await provider.putFile(data, fullPath);
            if (this.logging)
                this.logger.log('Screenshot thumb created');
            // Populate entity properties for the screenshot
            const entity = new screenshot_entity_1.Screenshot({
                organizationId,
                tenantId,
                userId,
                file: file.key,
                thumb: thumb.key,
                storageProvider: provider.name.toUpperCase(),
                timeSlotId: (0, class_validator_1.isUUID)(input.timeSlotId) ? input.timeSlotId : null,
                recordedAt: input.recordedAt ? input.recordedAt : new Date()
            });
            // Create the screenshot entity in the database
            const screenshot = await this._screenshotService.create(entity);
            if (this.logging)
                this.logger.log(`Screenshot created for employee`);
            // Publish the screenshot created event
            const ctx = context_1.RequestContext.currentRequestContext(); // Get current request context;
            const event = new screenshot_event_1.ScreenshotEvent(ctx, screenshot, base_entity_event_1.BaseEntityEventTypeEnum.CREATED, input, data, file);
            this._eventBus.publish(event); // Publish the event using EventBus
            // Find screenshot by ID
            return await this._screenshotService.findOneByIdString(screenshot.id);
        }
        catch (error) {
            this.logger.error(`Error while creating screenshot`);
        }
    }
    /**
     * Deletes a screenshot record by its ID.
     *
     * This endpoint allows authorized users to delete a screenshot record by providing its ID.
     * Additional query options can be provided to customize the delete operation.
     *
     * @param id - The UUID of the screenshot to delete.
     * @param options - Additional query options for deletion (e.g., soft delete or force delete).
     * @returns A Promise that resolves with the details of the deleted screenshot.
     */
    async delete(id, options) {
        return await this._screenshotService.deleteScreenshot(id, options);
    }
};
exports.ScreenshotController = ScreenshotController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Capture a start/stop screenshot',
        description: 'Captures a screenshot when the timer is started or stopped. This API allows uploading the screenshot file along with related metadata.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Screenshot captured successfully.',
        type: screenshot_entity_1.Screenshot
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input provided. Check the response body for error details.'
    }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(
    // Use LazyFileInterceptor for handling file uploads with custom storage settings
    (0, interceptors_1.LazyFileInterceptor)('file', {
        // Define storage settings for uploaded files
        storage: () => file_storage_1.FileStorageFactory.create('screenshots'),
        // Screenshots land under `uploads/screenshots` and are served unauthenticated from
        // `/public/<key>` with a Content-Type derived from the extension, so an `.svg`/`.html`
        // upload would execute script in the app origin — the same stored-XSS vector fixed on the
        // image-asset endpoint (GHSA-p334-cm7f-php5).
        fileFilter: file_storage_1.imageUploadFileFilter
    })),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, file_storage_1.UploadedFileStorage)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [screenshot_entity_1.Screenshot, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreenshotController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a screenshot by ID',
        description: 'Deletes a screenshot record from the system based on the provided ID.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The screenshot has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Screenshot record not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User does not have permission to delete screenshots.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.DELETE_SCREENSHOTS),
    (0, common_1.Delete)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, delete_screenshot_dto_1.DeleteScreenshotDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ScreenshotController.prototype, "delete", null);
exports.ScreenshotController = ScreenshotController = ScreenshotController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Screenshot'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TIME_TRACKER),
    (0, common_1.Controller)('/timesheet/screenshot'),
    tslib_1.__metadata("design:paramtypes", [screenshot_service_1.ScreenshotService, event_bus_1.EventBus])
], ScreenshotController);
//# sourceMappingURL=screenshot.controller.js.map