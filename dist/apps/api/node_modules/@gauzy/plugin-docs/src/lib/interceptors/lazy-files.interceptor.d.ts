import { NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
/**
 * Multi-file (≤ N) variant of the core `LazyFileInterceptor` (videos-plugin precedent):
 * the storage engine is constructed lazily **per request** so it sees `RequestContext`
 * (tenant scoping in the generated keys), then multer's `.array(fieldName, maxCount)`
 * runs the upload.
 *
 * @param fieldName The multipart field carrying the files (`files`).
 * @param maxCount Maximum number of files per request.
 * @param localOptions Multer options; `storage` is a per-request factory.
 */
export declare function LazyFilesInterceptor(fieldName: string, maxCount: number, localOptions?: MulterOptions): Type<NestInterceptor>;
