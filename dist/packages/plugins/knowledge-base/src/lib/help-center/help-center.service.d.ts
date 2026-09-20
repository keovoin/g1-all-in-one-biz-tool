import { DeleteResult } from 'typeorm';
import { IHelpCenter, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { HelpCenter } from './help-center.entity';
import { TypeOrmHelpCenterRepository } from './repository/type-orm-help-center.repository';
import { MikroOrmHelpCenterRepository } from './repository/mikro-orm-help-center.repository';
export declare class HelpCenterService extends TenantAwareCrudService<HelpCenter> {
    constructor(typeOrmHelpCenterRepository: TypeOrmHelpCenterRepository, mikroOrmHelpCenterRepository: MikroOrmHelpCenterRepository);
    updateBulk(updateInput: IHelpCenter[]): Promise<HelpCenter[]>;
    deleteBulkByBaseId(ids: ID[]): Promise<DeleteResult[]>;
    getCategoriesByBaseId(baseId: ID): Promise<HelpCenter[]>;
    getAllNodes(): Promise<HelpCenter[]>;
}
