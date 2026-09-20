"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializerInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const class_transformer_1 = require("class-transformer");
const context_1 = require("./../../core/context");
let SerializerInterceptor = class SerializerInterceptor extends common_1.ClassSerializerInterceptor {
    /**
     * Intercepts the response and transforms the data based on the user's role.
     *
     * @param ctx - The execution context.
     * @param next - The call handler.
     * @returns An observable that represents the intercepted response.
     */
    intercept(ctx, next) {
        // The role the caller holds in the database, attached to the request by JwtStrategy. The token's
        // `role` claim would keep exposing a demoted user's former serialization groups (and decoding it
        // here threw outright on a request that carries no bearer token).
        const role = context_1.RequestContext.currentRoleName();
        // Handle the response and transform the data based on the role
        return next.handle().pipe((0, operators_1.map)((data) => (0, class_transformer_1.instanceToPlain)(data, { groups: role ? [role] : [] })));
    }
};
exports.SerializerInterceptor = SerializerInterceptor;
exports.SerializerInterceptor = SerializerInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], SerializerInterceptor);
//# sourceMappingURL=serializer.interceptor.js.map