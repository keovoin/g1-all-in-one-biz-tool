"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDecorator = void 0;
const common_1 = require("@nestjs/common");
/**
 * Custom decorator to extract user information from the request object.
 *
 * @param data - Optional data parameter (not used in this implementation).
 * @param ctx - The execution context from which to extract the request object.
 * @returns The user object from the request, or an empty object if not found.
 */
exports.UserDecorator = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user || {};
});
//# sourceMappingURL=user.decorator.js.map