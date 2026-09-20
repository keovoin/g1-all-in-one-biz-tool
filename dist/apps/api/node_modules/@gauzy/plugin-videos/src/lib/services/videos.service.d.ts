import { TenantAwareCrudService } from '@gauzy/core';
import { Video } from '../entities/video.entity';
import { MikroOrmVideoRepository } from '../repositories/mikro-orm-video.repository';
import { TypeOrmVideoRepository } from '../repositories/type-orm-video.repository';
export declare class VideosService extends TenantAwareCrudService<Video> {
    readonly typeOrmVideoRepository: TypeOrmVideoRepository;
    readonly mikroOrmVideoRepository: MikroOrmVideoRepository;
    constructor(typeOrmVideoRepository: TypeOrmVideoRepository, mikroOrmVideoRepository: MikroOrmVideoRepository);
}
