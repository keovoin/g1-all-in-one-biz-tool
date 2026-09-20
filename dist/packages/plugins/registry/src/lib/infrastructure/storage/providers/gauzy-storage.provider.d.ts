import { FileStorage } from '@gauzy/core';
import { FileDTO } from '../../../shared/dto/file.dto';
import { IFileMetadata, IStorageProvider } from '../../../shared/models/storage-provider.model';
export declare class GauzyStorageProvider implements IStorageProvider {
    private readonly fileStorage;
    constructor(fileStorage: FileStorage);
    validate(file: FileDTO): Promise<void>;
    delete(fileKey: string): Promise<void>;
    extractMetadata(file: FileDTO): IFileMetadata;
}
