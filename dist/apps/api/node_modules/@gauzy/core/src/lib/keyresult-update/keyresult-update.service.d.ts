import { ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmKeyResultUpdateRepository } from './repository/type-orm-keyresult-update.repository';
import { MikroOrmKeyResultUpdateRepository } from './repository/mikro-orm-keyresult-update.repository';
import { KeyResultUpdate } from './keyresult-update.entity';
export declare class KeyResultUpdateService extends TenantAwareCrudService<KeyResultUpdate> {
    constructor(typeOrmKeyResultUpdateRepository: TypeOrmKeyResultUpdateRepository, mikroOrmKeyResultUpdateRepository: MikroOrmKeyResultUpdateRepository);
    /**
     *
     * @param keyResultId
     * @returns
     */
    findByKeyResultId(keyResultId: ID): Promise<KeyResultUpdate[]>;
}
