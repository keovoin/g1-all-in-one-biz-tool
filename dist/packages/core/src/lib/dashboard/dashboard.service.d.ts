import { IDashboardCreateInput, IDashboardUpdateInput, ID } from '@gauzy/contracts';
import { DeleteResult } from 'typeorm';
import { TenantAwareCrudService } from '../core/crud/tenant-aware-crud.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Dashboard } from './dashboard.entity';
import { TypeOrmDashboardRepository } from './repository/type-orm-dashboard.repository';
import { MikroOrmDashboardRepository } from './repository/mikro-orm-dashboard.repository';
export declare class DashboardService extends TenantAwareCrudService<Dashboard> {
    readonly typeOrmDashboardRepository: TypeOrmDashboardRepository;
    readonly mikroOrmDashboardRepository: MikroOrmDashboardRepository;
    private readonly _activityLogService;
    constructor(typeOrmDashboardRepository: TypeOrmDashboardRepository, mikroOrmDashboardRepository: MikroOrmDashboardRepository, _activityLogService: ActivityLogService);
    /**
     * Creates a new dashboard.
     *
     * @param input - The data required to create a new dashboard.
     * @returns The created Dashboard entity.
     * @throws {HttpException} If the creation process fails.
     */
    create(input: IDashboardCreateInput): Promise<Dashboard>;
    /**
     * Updates an existing dashboard.
     *
     * @param id - The unique identifier of the dashboard to update.
     * @param input - The data to update the dashboard with.
     * @returns A promise that resolves to the updated Dashboard entity.
     * @throws {NotFoundException} If the dashboard with the given ID does not exist.
     * @throws {HttpException} If the update process fails.
     */
    update(id: ID, input: IDashboardUpdateInput): Promise<Dashboard>;
    /**
     * Deletes a dashboard by ID, ensuring the requesting user owns it.
     *
     * @param id - The unique identifier of the dashboard to delete.
     * @returns The delete result.
     * @throws {ForbiddenException} If the dashboard belongs to another user.
     */
    delete(id: ID): Promise<DeleteResult>;
    /**
     * Ensures the current user is the creator of the given dashboard.
     *
     * @param dashboard - The dashboard to verify ownership of.
     * @throws {ForbiddenException} If the dashboard was created by another user.
     */
    private checkOwnership;
    /**
     * Demotes all default dashboards of the dashboard's creator (within the same
     * tenant/organization), so that at most one dashboard is default per user.
     *
     * Uses `find` + `save` (via `super.create`) to stay ORM-agnostic (TypeORM/MikroORM).
     *
     * @param dashboard - The dashboard being promoted to default.
     */
    private resetDefaultDashboards;
}
