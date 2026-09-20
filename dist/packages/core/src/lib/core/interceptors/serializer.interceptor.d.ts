import { ExecutionContext, CallHandler, ClassSerializerInterceptor, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class SerializerInterceptor extends ClassSerializerInterceptor implements NestInterceptor {
    /**
     * Intercepts the response and transforms the data based on the user's role.
     *
     * @param ctx - The execution context.
     * @param next - The call handler.
     * @returns An observable that represents the intercepted response.
     */
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any>;
}
