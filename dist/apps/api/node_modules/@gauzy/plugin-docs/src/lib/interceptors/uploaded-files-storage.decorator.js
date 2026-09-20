"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedFilesStorage = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const logger = new common_1.Logger('UploadedFilesStorage');
/**
 * Multi-file counterpart of the core `@UploadedFileStorage()` decorator: maps every
 * uploaded file on the request (`request.files`, populated by `LazyFilesInterceptor`)
 * through the active storage provider's `mapUploadedFile`.
 *
 * @returns `Promise<UploadedFile[]>` — an empty array when no files were sent.
 */
exports.UploadedFilesStorage = (0, common_1.createParamDecorator)(async (data, ctx) => {
    try {
        const request = ctx.switchToHttp().getRequest();
        const files = Array.isArray(request.files) ? request.files : [];
        const provider = new core_1.FileStorage().getProvider(data);
        return await Promise.all(files.map((file) => provider.mapUploadedFile(file)));
    }
    catch (error) {
        logger.error('Error while mapping uploaded files');
        throw new common_1.BadRequestException('Error while mapping uploaded files', error);
    }
});
//# sourceMappingURL=uploaded-files-storage.decorator.js.map