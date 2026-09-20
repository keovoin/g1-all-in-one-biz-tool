import { NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
export declare function LazyAnyFileInterceptor(localOptions?: MulterOptions): Type<NestInterceptor>;
