import { DeepPartial } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud/tenant-aware-crud.service';
import { Deal } from './deal.entity';
import { TypeOrmDealRepository } from './repository/type-orm-deal.repository';
import { MikroOrmDealRepository } from './repository/mikro-orm-deal.repository';
export declare class DealService extends TenantAwareCrudService<Deal> {
    readonly typeOrmDealRepository: TypeOrmDealRepository;
    readonly mikroOrmDealRepository: MikroOrmDealRepository;
    constructor(typeOrmDealRepository: TypeOrmDealRepository, mikroOrmDealRepository: MikroOrmDealRepository);
    /**
     * Creates a new deal entity.
     *
     * This method sets the `createdByUserId` using the current user's ID from the request context,
     * then calls the create method on the superclass (likely a service or repository) with the modified entity data.
     *
     * @param entity - The partial deal entity data to create.
     * @returns A promise that resolves to the created deal entity.
     */
    create(entity: DeepPartial<Deal>): Promise<Deal>;
}
