import { Repository } from 'typeorm';
import { Reaction } from '../reaction.entity';
export declare class TypeOrmReactionRepository extends Repository<Reaction> {
    readonly repository: Repository<Reaction>;
    constructor(repository: Repository<Reaction>);
}
