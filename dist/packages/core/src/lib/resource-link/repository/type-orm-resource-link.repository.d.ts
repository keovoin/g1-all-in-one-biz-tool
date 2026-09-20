import { Repository } from 'typeorm';
import { ResourceLink } from '../resource-link.entity';
export declare class TypeOrmResourceLinkRepository extends Repository<ResourceLink> {
    readonly repository: Repository<ResourceLink>;
    constructor(repository: Repository<ResourceLink>);
}
