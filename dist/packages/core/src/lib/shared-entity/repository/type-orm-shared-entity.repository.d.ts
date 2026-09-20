import { Repository } from "typeorm";
import { SharedEntity } from "../shared-entity.entity";
export declare class TypeOrmSharedEntityRepository extends Repository<SharedEntity> {
    readonly repository: Repository<SharedEntity>;
    constructor(repository: Repository<SharedEntity>);
}
