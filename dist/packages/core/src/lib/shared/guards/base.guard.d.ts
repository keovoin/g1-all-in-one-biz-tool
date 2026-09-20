import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export declare abstract class BaseGuard implements CanActivate {
    /**
     * Determines whether the current request is authorized to proceed.
     * @param context - The execution context of the request.
     * @returns A boolean or a Promise resolving to a boolean indicating whether the request is allowed.
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean>;
    /**
     * Retrieves the request object from the execution context, supporting both HTTP and GraphQL requests.
     *
     * @param context - The execution context of the request.
     * @returns The `Request` object extracted from the context.
     */
    protected getRequest(context: ExecutionContext): Request;
}
