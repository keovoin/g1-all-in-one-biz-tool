import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
declare const MicrosoftAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class MicrosoftAuthGuard extends MicrosoftAuthGuard_base {
    /**
     * Determines whether the current request is allowed.
     *
     * @param context - The execution context for the incoming request.
     * @returns A boolean, Promise<boolean>, or Observable<boolean> indicating whether access is granted.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    /**
     * Sets session-related properties for Passport.
     *
     * @param roleName - The role name from the request query.
     * @param baseUrl - The referer URL from which the client URL is derived.
     */
    private setPassportSession;
}
export {};
