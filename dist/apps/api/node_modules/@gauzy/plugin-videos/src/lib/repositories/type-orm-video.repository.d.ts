import { Repository } from 'typeorm';
import { Video } from '../entities/video.entity';
export declare class TypeOrmVideoRepository extends Repository<Video> {
    readonly repository: Repository<Video>;
    constructor(repository: Repository<Video>);
}
