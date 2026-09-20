"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const class_transformer_1 = require("class-transformer");
const safe_http_exception_1 = require("./safe-http-exception");
let TransformInterceptor = class TransformInterceptor {
    /**
     * Intercepts the execution context and the call handler.
     * Transforms the data using class-transformer's instanceToPlain.
     * Catches and handles errors, returning appropriate exceptions.
     * @param ctx - The execution context.
     * @param next - The call handler.
     * @returns An observable that represents the intercepted response.
     */
    intercept(ctx, next) {
        return next.handle().pipe(
        // Transform the data using class-transformer's instanceToPlain
        (0, operators_1.map)((data) => (0, class_transformer_1.instanceToPlain)(data)), 
        // Catch and handle errors
        // One rule for every error that escapes a controller — see `toSafeHttpException`:
        // BadRequest bodies intact, other HTTP exceptions keep their STRUCTURED body minus
        // driver/transport internals, non-HTTP errors become a real 5xx (never a 200).
        (0, operators_1.catchError)((error) => {
            throw (0, safe_http_exception_1.toSafeHttpException)(error);
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map