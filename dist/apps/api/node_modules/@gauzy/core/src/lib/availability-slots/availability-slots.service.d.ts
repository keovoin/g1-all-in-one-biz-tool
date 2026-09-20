import { IAvailabilitySlot, IAvailabilitySlotsCreateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmAvailabilitySlotRepository } from './repository/type-orm-availability-slot.repository';
import { MikroOrmAvailabilitySlotRepository } from './repository/mikro-orm-availability-slot.repository';
import { AvailabilitySlot } from './availability-slots.entity';
export declare class AvailabilitySlotsService extends TenantAwareCrudService<AvailabilitySlot> {
    constructor(typeOrmAvailabilitySlotRepository: TypeOrmAvailabilitySlotRepository, mikroOrmAvailabilitySlotRepository: MikroOrmAvailabilitySlotRepository);
    /**
     * Create bulk availability slots
     *
     * @param slots
     * @returns
     */
    createBulk(slots: IAvailabilitySlotsCreateInput[]): Promise<IAvailabilitySlot[]>;
}
