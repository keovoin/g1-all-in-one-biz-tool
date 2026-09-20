"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyFileInterceptor = LazyFileInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const files_constants_1 = require("@nestjs/platform-express/multer/files.constants");
const multer_utils_1 = require("@nestjs/platform-express/multer/multer/multer.utils");
const multer = require("multer");
function LazyFileInterceptor(fieldName, localOptions) {
    let MixinInterceptor = class MixinInterceptor {
        constructor(options = {}) {
            this.options = options;
            this.logger = new common_1.Logger('LazyFileInterceptor');
        }
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const storage = localOptions.storage(context);
            this.multer = multer({
                ...this.options,
                ...{
                    storage,
                    // No optional chaining on `localOptions` here: it is a REQUIRED parameter (the call
                    // above already dereferences it), and a `?.` would imply otherwise — DeepScan rightly
                    // flags the inconsistency (INSUFFICIENT_NULL_CHECK).
                    //
                    // Pass through a per-route fileFilter when provided (e.g. to block executable/SVG uploads).
                    ...(localOptions.fileFilter ? { fileFilter: localOptions.fileFilter } : {}),
                    // …and `limits` likewise. Dropping it was the same silent-no-op trap as the missing
                    // storage factory, one step further along: a route declaring `limits: { fileSize }`
                    // read as capped while accepting uploads of any size, and nothing failed to say so.
                    // No caller relies on the old behaviour — none currently declare `limits` — so this
                    // only changes what happens the next time someone reasonably expects it to work.
                    ...(localOptions.limits ? { limits: localOptions.limits } : {})
                }
            });
            await new Promise((resolve, reject) => this.multer.single(fieldName)(ctx.getRequest(), ctx.getResponse(), (err) => {
                if (err) {
                    const error = (0, multer_utils_1.transformException)(err);
                    this.logger.error('Error while uploading file using multer', err?.stack ?? String(err));
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
//# sourceMappingURL=lazy-file-interceptor.js.map