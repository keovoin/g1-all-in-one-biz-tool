import { TenantAwareCrudService } from '@gauzy/core';
import { Soundshot } from '../entity/soundshot.entity';
import { TypeOrmSoundshotRepository } from '../repositories/type-orm-soundshot.repository';
import { MikroOrmSoundshotRepository } from '../repositories/mikro-orm-soundshot.repository';
import { FileDTO } from '../dtos/file.dto';
import { FileStorageProviderEnum } from '@gauzy/contracts';
import { IPreparedFile } from '../models/prepare.model';
export declare class SoundshotService extends TenantAwareCrudService<Soundshot> {
    readonly typeOrmSoundshotRepository: TypeOrmSoundshotRepository;
    readonly mikroOrmSoundshotRepository: MikroOrmSoundshotRepository;
    private readonly fileStorage;
    constructor(typeOrmSoundshotRepository: TypeOrmSoundshotRepository, mikroOrmSoundshotRepository: MikroOrmSoundshotRepository);
    /**
     * Prepare the file for the soundshot service
     * @param file - The file to prepare
     * @returns The prepared file
     */
    prepare(file: FileDTO): Promise<IPreparedFile>;
    getFileStorageProviderInstance(storageProviderEnum?: FileStorageProviderEnum): import("dist/packages/core/src/lib/core/file-storage/providers/provider").Provider<any>;
}
