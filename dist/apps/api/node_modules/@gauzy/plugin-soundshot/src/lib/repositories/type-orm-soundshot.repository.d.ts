import { Repository } from 'typeorm';
import { Soundshot } from '../entity/soundshot.entity';
export declare class TypeOrmSoundshotRepository extends Repository<Soundshot> {
    readonly repository: Repository<Soundshot>;
    constructor(repository: Repository<Soundshot>);
}
