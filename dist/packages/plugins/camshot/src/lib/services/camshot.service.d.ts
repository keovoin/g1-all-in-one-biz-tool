import { TenantAwareCrudService } from '@gauzy/core';
import { Camshot } from '../entity/camshot.entity';
import { TypeOrmCamshotRepository } from '../repositories/type-orm-camshot.repository';
import { MikroOrmCamshotRepository } from '../repositories/mikro-orm-camshot.repository';
import { FileDTO } from '../dtos/file.dto';
import { IPreparedFile } from '../models/prepare.model';
export declare class CamshotService extends TenantAwareCrudService<Camshot> {
    readonly typeOrmCamshotRepository: TypeOrmCamshotRepository;
    readonly mikroOrmCamshotRepository: MikroOrmCamshotRepository;
    private readonly logger;
    constructor(typeOrmCamshotRepository: TypeOrmCamshotRepository, mikroOrmCamshotRepository: MikroOrmCamshotRepository);
    /**
     * Prepare the file for the camshot service
     * @param file - The file to prepare
     * @returns The prepared file
     */
    prepare(file: FileDTO): Promise<IPreparedFile>;
    createThumbnail(provider: any, file: FileDTO): Promise<FileDTO>;
}
