import { EntityRepositoryType } from '@mikro-orm/core';
import { DailyPlanStatusEnum, ID, IDailyPlan, IEmployee, IOrganizationTeam, ITask } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../../core/entities/internal';
import { MikroOrmDailyPlanRepository } from './repository/mikro-orm-daily-plan.repository';
export declare class DailyPlan extends TenantOrganizationBaseEntity implements IDailyPlan {
    [EntityRepositoryType]?: MikroOrmDailyPlanRepository;
    date: Date;
    workTimePlanned: number;
    status: DailyPlanStatusEnum;
    /**
     * Employee
     */
    employee?: IEmployee;
    employeeId?: ID;
    /**
     * OrganizationTeam
     */
    organizationTeam?: IOrganizationTeam;
    organizationTeamId?: ID;
    /**
     * Daily Planned Tasks
     */
    tasks?: ITask[];
}
