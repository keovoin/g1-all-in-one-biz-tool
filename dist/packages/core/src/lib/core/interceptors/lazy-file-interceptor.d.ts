import { ExecutionContext, NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
/**
 * Options for {@link LazyFileInterceptor}.
 *
 * `storage` is a FACTORY, not a `StorageEngine` — that is the whole point of this interceptor, which
 * resolves the destination per request (tenant folder, provider, …) rather than once at module load.
 * It is REQUIRED and typed as such: `MulterOptions.storage` is `any`, so the previous signature both
 * accepted a caller that omitted it and accepted one that passed an engine instead of a factory.
 * Either mistake compiles and then throws a TypeError on the first upload — the route answers 500
 * with nothing pointing at the cause. That is not hypothetical: it shipped on the chat's dictation
 * endpoint and broke every attempt to use it.
 */
export type LazyFileInterceptorOptions = Omit<MulterOptions, 'storage'> & {
    storage: (context: ExecutionContext) => multer.StorageEngine;
};
export declare function LazyFileInterceptor(fieldName: string, localOptions: LazyFileInterceptorOptions): Type<NestInterceptor>;
