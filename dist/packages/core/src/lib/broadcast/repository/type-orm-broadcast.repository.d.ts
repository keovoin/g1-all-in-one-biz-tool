import { Repository } from 'typeorm';
import { Broadcast } from '../broadcast.entity';
export declare class TypeOrmBroadcastRepository extends Repository<Broadcast> {
    readonly repository: Repository<Broadcast>;
    constructor(repository: Repository<Broadcast>);
}
