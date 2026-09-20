import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const AuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AuthGuard extends AuthGuard_base {
    private readonly _reflector;
    constructor(_reflector: Reflector);
    /**
     * Determines if the current request can be activated based on authorization and PUBLIC decorators.
     *
     * @param context - The execution context of the request.
     * @returns `true` if access is allowed, otherwise `false`.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    /**
     * Retrieves the request object from the execution context, supporting both HTTP and GraphQL requests.
     *
     * @param context - The execution context of the request.
     * @returns The `Request` object extracted from the context.
     */
    getRequest(context: ExecutionContext): Request;
}
export {};
