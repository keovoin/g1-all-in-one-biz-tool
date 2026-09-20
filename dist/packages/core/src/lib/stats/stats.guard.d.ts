import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class StatsGuard implements CanActivate {
    private readonly _reflector;
    loggingEnabled: boolean;
    constructor(_reflector: Reflector);
    /**
     * Determines if the current request can be activated based on feature flag metadata.
     * @param context The execution context of the request.
     * @returns A boolean indicating whether access is allowed.
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
