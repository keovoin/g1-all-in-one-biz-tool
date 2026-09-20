import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthenticationFlagFeatures } from '@gauzy/contracts';
/**
 * Object containing flag features for authentication.
 */
export declare const flagFeatures: IAuthenticationFlagFeatures;
/**
 * Feature enabled/disabled guard
 *
 * @returns
 */
export declare class FeatureFlagEnabledGuard implements CanActivate {
    private readonly _reflector;
    constructor(_reflector: Reflector);
    /**
     *
     * @param context
     * @returns
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
