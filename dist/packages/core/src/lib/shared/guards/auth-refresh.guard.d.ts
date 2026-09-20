import { ExecutionContext } from '@nestjs/common';
declare const AuthRefreshGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AuthRefreshGuard extends AuthRefreshGuard_base {
    /**
     * Determines if the current request can proceed by invoking the base class's `canActivate` method.
     * This is used to enforce authentication and authorization logic defined in the extended class.
     *
     * @param context - The execution context of the request, providing access to details such as the request object and route metadata.
     * @returns A boolean or a Promise resolving to `true` if the request is authorized, otherwise throws an exception.
     * @throws `UnauthorizedException` if the authentication fails or the user lacks the necessary permissions.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
}
export {};
