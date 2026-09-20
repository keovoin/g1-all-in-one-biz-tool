"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
let BaseGuard = class BaseGuard {
    /**
     * Determines whether the current request is authorized to proceed.
     * @param context - The execution context of the request.
     * @returns A boolean or a Promise resolving to a boolean indicating whether the request is allowed.
     */
    canActivate(context) {
        // Implement your authorization logic here
        return true; // Allow all requests; replace with actual logic
    }
    /**
     * Retrieves the request object from the execution context, supporting both HTTP and GraphQL requests.
     *
     * @param context - The execution context of the request.
     * @returns The `Request` object extracted from the context.
     */
    getRequest(context) {
        // Check if the execution context is of type 'graphql'
        if (context.getType() === 'graphql') {
            // Extract the request object from the GraphQL context
            return graphql_1.GqlExecutionContext.create(context).getContext().req;
        }
        // If the context is HTTP-based, extract the request object from the HTTP context
        return context.switchToHttp().getRequest();
    }
};
exports.BaseGuard = BaseGuard;
exports.BaseGuard = BaseGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], BaseGuard);
//# sourceMappingURL=base.guard.js.map