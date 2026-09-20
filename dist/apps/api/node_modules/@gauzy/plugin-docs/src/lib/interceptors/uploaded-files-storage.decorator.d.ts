import { FileStorageProviderEnum } from '@gauzy/contracts';
/**
 * Multi-file counterpart of the core `@UploadedFileStorage()` decorator: maps every
 * uploaded file on the request (`request.files`, populated by `LazyFilesInterceptor`)
 * through the active storage provider's `mapUploadedFile`.
 *
 * @returns `Promise<UploadedFile[]>` — an empty array when no files were sent.
 */
export declare const UploadedFilesStorage: (...dataOrPipes: (FileStorageProviderEnum | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
