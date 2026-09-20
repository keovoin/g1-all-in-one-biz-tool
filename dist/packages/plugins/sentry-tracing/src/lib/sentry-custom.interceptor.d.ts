import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SentryInterceptor } from './ntegral';
export declare class SentryCustomInterceptor extends SentryInterceptor {
    constructor();
    /**
     * Intercepts the execution context and handles errors.
     * @param {ExecutionContext} context - The execution context.
     * @param {CallHandler} next - The call handler.
     * @returns {Observable<any>} An observable that represents the result of the intercepted operation.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
