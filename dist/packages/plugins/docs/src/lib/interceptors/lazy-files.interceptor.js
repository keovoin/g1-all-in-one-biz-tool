"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyFilesInterceptor = LazyFilesInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const files_constants_1 = require("@nestjs/platform-express/multer/files.constants");
const multer_utils_1 = require("@nestjs/platform-express/multer/multer/multer.utils");
const multer = require("multer");
/**
 * Multi-file (≤ N) variant of the core `LazyFileInterceptor` (videos-plugin precedent):
 * the storage engine is constructed lazily **per request** so it sees `RequestContext`
 * (tenant scoping in the generated keys), then multer's `.array(fieldName, maxCount)`
 * runs the upload.
 *
 * @param fieldName The multipart field carrying the files (`files`).
 * @param maxCount Maximum number of files per request.
 * @param localOptions Multer options; `storage` is a per-request factory.
 */
function LazyFilesInterceptor(fieldName, maxCount, localOptions) {
    let MixinInterceptor = class MixinInterceptor {
        constructor(options = {}) {
            this.options = options;
            this.logger = new common_1.Logger('LazyFilesInterceptor');
        }
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            // The storage option is a per-request factory (core LazyFileInterceptor precedent).
            const storage = typeof localOptions?.storage === 'function' ? localOptions.storage(context) : undefined;
            this.multer = multer({
                ...this.options,
                ...(storage ? { storage } : {}),
                ...(localOptions?.limits ? { limits: localOptions.limits } : {}),
                ...(localOptions?.fileFilter ? { fileFilter: localOptions.fileFilter } : {})
            });
            await new Promise((resolve, reject) => this.multer.array(fieldName, maxCount)(ctx.getRequest(), ctx.getResponse(), (err) => {
                if (err) {
                    const error = (0, multer_utils_1.transformException)(err);
                    this.logger.error('Error while uploading files using multer', err?.stack ?? String(err));
                    return reject(error);
                }
                resolve();
            }));
            return next.handle();
        }
    };
    MixinInterceptor = tslib_1.__decorate([
        tslib_1.__param(0, (0, common_1.Optional)()),
        tslib_1.__param(0, (0, common_1.Inject)(files_constants_1.MULTER_MODULE_OPTIONS)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], MixinInterceptor);
    const Interceptor = (0, common_1.mixin)(MixinInterceptor);
    return Interceptor;
}
//# sourceMappingURL=lazy-files.interceptor.js.map