import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
declare const KeycloakAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class KeycloakAuthGuard extends KeycloakAuthGuard_base {
    /**
     * Determines whether a request should be allowed based on session data.
     *
     * @param context - The execution context containing the incoming request.
     * @returns A boolean, a Promise of a boolean, or an Observable of a boolean.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    /**
     * Sets the session configuration for Passport by updating the client URL and role name.
     *
     * @param roleName - The role name retrieved from the request query.
     * @param baseUrl - The base URL extracted from the request headers.
     */
    private setPassportSession;
}
export {};
