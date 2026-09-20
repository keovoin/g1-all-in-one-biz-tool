import { CanActivate, ExecutionContext } from '@nestjs/common';
/** A bounded, per-process limit before credential lookup, independent of optional global throttling. */
export declare class EverAsyncRateLimitGuard implements CanActivate {
    private readonly clients;
    private readonly capacity;
    private readonly windowMs;
    private readonly limit;
    private configuredLimit;
    canActivate(context: ExecutionContext): boolean;
    private refuse;
}
