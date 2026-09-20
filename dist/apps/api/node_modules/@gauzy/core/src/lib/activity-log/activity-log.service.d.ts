import { EventBus } from '@nestjs/cqrs';
import { ActionTypeEnum, ActorTypeEnum, BaseEntityEnum, IActivityLog, IActivityLogInput, ID, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { GetActivityLogsDTO } from './dto/get-activity-logs.dto';
import { ActivityLog } from './activity-log.entity';
import { TypeOrmActivityLogRepository } from './repository/type-orm-activity-log.repository';
import { MikroOrmActivityLogRepository } from './repository/mikro-orm-activity-log.repository';
export declare class ActivityLogService extends TenantAwareCrudService<ActivityLog> {
    readonly typeOrmActivityLogRepository: TypeOrmActivityLogRepository;
    readonly mikroOrmActivityLogRepository: MikroOrmActivityLogRepository;
    private readonly _eventBus;
    constructor(typeOrmActivityLogRepository: TypeOrmActivityLogRepository, mikroOrmActivityLogRepository: MikroOrmActivityLogRepository, _eventBus: EventBus);
    /**
     * Creates a new activity log entry with the provided input, while associating it with the current employee and tenant.
     *
     * @param input - The data required to create an activity log entry.
     * @returns The created activity log entry.
     * @throws BadRequestException when the log creation fails.
     */
    create(input: IActivityLogInput): Promise<IActivityLog>;
    /**
     * Finds and retrieves activity logs based on the given filters criteria.
     *
     * @param {GetActivityLogsDTO} filters - Filter criteria to find activity logs, including entity, entityId, action, actorType, isActive, isArchived, orderBy, and order.
     * @returns {Promise<IPagination<IActivityLog>>} - A promise that resolves to a paginated list of activity logs.
     *
     * Example usage:
     * ```
     * const logs = await findActivityLogs({
     *     entity: 'User',
     *     action: 'CREATE',
     *     orderBy: 'updatedAt',
     *     order: 'ASC'
     * });
     * ```
     */
    findActivityLogs(filters: GetActivityLogsDTO): Promise<IPagination<IActivityLog>>;
    /**
     * @description Create or Update Activity Log
     * @template T
     * @param {BaseEntityEnum} entity - Entity type for whom creating activity log (E.g : Task, OrganizationProject, etc.)
     * @param {string} entityName - Name or Title of the entity
     * @param {ActorTypeEnum} actor - The actor type performing the action (User or System)
     * @param {ID} organizationId
     * @param {ID} tenantId
     * @param {ActionTypeEnum} actionType - Action performed (Created or Updated)
     * @param {T} data - Entity data (for Created action) or Updated entity data (for Updated action)
     * @param {Partial<T>} [originalValues] - Entity data before update (optional for Update action)
     * @param {Partial<T>} [newValues] - Entity updated data per field (optional for Update action)
     */
    logActivity<T>(entity: BaseEntityEnum, actionType: ActionTypeEnum, actor: ActorTypeEnum, entityId: ID, entityName: string, data: T, organizationId: ID, tenantId: ID, originalValues?: Partial<T>, newValues?: Partial<T>): void;
}
