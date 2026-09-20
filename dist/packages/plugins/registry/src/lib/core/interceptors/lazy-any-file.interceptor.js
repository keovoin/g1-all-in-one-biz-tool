"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyAnyFileInterceptor = LazyAnyFileInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const files_constants_1 = require("@nestjs/platform-express/multer/files.constants");
const multer_utils_1 = require("@nestjs/platform-express/multer/multer/multer.utils");
const multer = require("multer");
function LazyAnyFileInterceptor(localOptions) {
    let MixinInterceptor = class MixinInterceptor {
        constructor(options = {}) {
            this.options = options;
        }
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const storage = localOptions?.storage?.(context);
            this.multer = multer({
                ...this.options,
                ...localOptions,
                ...(storage && { storage })
            });
            await new Promise((resolve, reject) => {
                // Use multer.any() to accept any field names
                const multerHandler = this.multer.any();
                multerHandler(ctx.getRequest(), ctx.getResponse(), (err) => {
                    if (err) {
                        const error = (0, multer_utils_1.transformException)(err);
                        return reject(error);
                    }
                    resolve();
                });
            });
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
//# sourceMappingURL=lazy-any-file.interceptor.js.map