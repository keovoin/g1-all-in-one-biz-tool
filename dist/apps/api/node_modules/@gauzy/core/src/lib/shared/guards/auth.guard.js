"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const passport_1 = require("@nestjs/passport");
const constants_1 = require("@gauzy/constants");
let AuthGuard = class AuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(_reflector) {
        super();
        this._reflector = _reflector;
    }
    /**
     * Determines if the current request can be activated based on authorization and PUBLIC decorators.
     *
     * @param context - The execution context of the request.
     * @returns `true` if access is allowed, otherwise `false`.
     */
    canActivate(context) {
        // Retrieve the request object from the context
        const request = this.getRequest(context);
        // Allow CORS preflight (OPTIONS) requests to pass without authentication
        if (request.method === 'OPTIONS') {
            return true;
        }
        // Check if the route or controller has the PUBLIC decorator
        const isPublic = this._reflector.get(constants_1.PUBLIC_METHOD_METADATA, context.getHandler()) ||
            this._reflector.get(constants_1.PUBLIC_METHOD_METADATA, context.getClass());
        // Allow access if the method or class has the PUBLIC decorator
        if (isPublic) {
            return true;
        }
        // Delegate authorization to the parent guard (JWT or API Key authentication)
        return super.canActivate(context);
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
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map