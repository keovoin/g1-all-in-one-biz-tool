import { Repository } from 'typeorm';
import { Changelog } from '../changelog.entity';
export declare class TypeOrmChangelogRepository extends Repository<Changelog> {
    readonly repository: Repository<Changelog>;
    constructor(repository: Repository<Changelog>);
}
