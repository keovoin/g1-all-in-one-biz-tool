import { Repository } from 'typeorm';
import { Mention } from '../mention.entity';
export declare class TypeOrmMentionRepository extends Repository<Mention> {
    readonly repository: Repository<Mention>;
    constructor(repository: Repository<Mention>);
}
