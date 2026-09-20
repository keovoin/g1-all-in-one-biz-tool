import { FileStorageProviderEnum } from '@gauzy/contracts';
/**
 * Custom decorator to map uploaded plugin based on the specified storage provider.
 *
 * @param storageProvider - The storage provider enum.
 * @returns Promise<UploadedFile | undefined>
 *
 * @throws BadRequestException if there's an error mapping the file
 */
export declare const UploadedPluginStorage: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | {
    storageProvider?: FileStorageProviderEnum;
    multiple?: boolean;
})[]) => ParameterDecorator;
