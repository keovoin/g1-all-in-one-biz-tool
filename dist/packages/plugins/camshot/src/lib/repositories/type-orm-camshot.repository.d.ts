import { Repository } from 'typeorm';
import { Camshot } from '../entity/camshot.entity';
export declare class TypeOrmCamshotRepository extends Repository<Camshot> {
    readonly repository: Repository<Camshot>;
    constructor(repository: Repository<Camshot>);
}
