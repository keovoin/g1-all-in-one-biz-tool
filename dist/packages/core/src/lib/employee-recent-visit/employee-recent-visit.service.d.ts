import { EventBus } from '@nestjs/cqrs';
import { BaseEntityEnum, ID, IEmployeeRecentVisit, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud';
import { EmployeeRecentVisit } from './employee-recent-visit.entity';
import { MikroOrmEmployeeRecentVisitRepository } from './repository/mikro-orm-employee-recent-visit.repository';
import { TypeOrmEmployeeRecentVisitRepository } from './repository/type-orm-employee-recent-visit.repository';
import { GetEmployeeRecentVisitsDTO } from './dto/get-employee-recent-visits.dto';
export declare class EmployeeRecentVisitService extends TenantAwareCrudService<EmployeeRecentVisit> {
    readonly typeOrmEmployeeRecentVisitRepository: TypeOrmEmployeeRecentVisitRepository;
    readonly mikroOrmEmployeeRecentVisitRepository: MikroOrmEmployeeRecentVisitRepository;
    private readonly _eventBus;
    constructor(typeOrmEmployeeRecentVisitRepository: TypeOrmEmployeeRecentVisitRepository, mikroOrmEmployeeRecentVisitRepository: MikroOrmEmployeeRecentVisitRepository, _eventBus: EventBus);
    /**
     * Creates a new employee recent visit entry with the provided input, while associating it with the current employee and tenant.
     *
     * @param input - The data required to create an employee recent visit entry.
     * @returns The created employee recent visit entry.
     * @throws BadRequestException when the visit creation fails.
     */
    create(input: IEmployeeRecentVisit): Promise<IEmployeeRecentVisit>;
    /**
     * Finds employee recent visits based on the provided filters.
     *
     * @param filters - The filters for finding employee recent visits.
     * @returns A promise that resolves with the employee recent visits.
     * @throws BadRequestException when the finding employee recent visits fails.
     */
    findEmployeeRecentVisits(filters: GetEmployeeRecentVisitsDTO): Promise<IPagination<IEmployeeRecentVisit>>;
    /**
     * Emits an event to create a new employee recent visit entry with the provided input.
     *
     * @param input - The data required to create an employee recent visit entry.
     * @returns A promise that resolves with the created employee recent visit entry.
     * @throws BadRequestException when the event emission fails.
     */
    emitSaveEmployeeRecentVisitEvent<T>(entity: BaseEntityEnum, entityId: ID, data: T, organizationId: ID, tenantId: ID): any;
}
