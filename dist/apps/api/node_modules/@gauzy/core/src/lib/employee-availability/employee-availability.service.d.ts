import { IEmployeeAvailability } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud/tenant-aware-crud.service';
import { TypeOrmEmployeeAvailabilityRepository } from './repository/type-orm-employee-availability.repository';
import { MikroOrmEmployeeAvailabilityRepository } from './repository/mikro-orm-employee-availability.repository';
import { EmployeeAvailability } from './employee-availability.entity';
export declare class EmployeeAvailabilityService extends TenantAwareCrudService<EmployeeAvailability> {
    readonly typeOrmEmployeeAvailabilityRepository: TypeOrmEmployeeAvailabilityRepository;
    readonly mikroOrmEmployeeAvailabilityRepository: MikroOrmEmployeeAvailabilityRepository;
    constructor(typeOrmEmployeeAvailabilityRepository: TypeOrmEmployeeAvailabilityRepository, mikroOrmEmployeeAvailabilityRepository: MikroOrmEmployeeAvailabilityRepository);
    /**
     * Bulk creates new employee availability records while ensuring each entity has `tenantId`.
     * Supports both TypeORM & MikroORM.
     *
     * @param entities List of employee availability objects to create.
     * @returns Promise<IEmployeeAvailability[]> List of created employee availability records.
     */
    bulkCreate(entities: Partial<EmployeeAvailability>[]): Promise<IEmployeeAvailability[]>;
}
