import { TenantAwareCrudService } from './../../core/crud';
import { Activity } from './activity.entity';
import { IGetActivitiesInput, IDailyActivity, IBulkActivitiesInput, IActivity } from '@gauzy/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmActivityRepository } from './repository/type-orm-activity.repository';
import { MikroOrmActivityRepository } from './repository/mikro-orm-activity.repository';
import { TypeOrmEmployeeRepository } from '../../employee/repository/type-orm-employee.repository';
import { TypeOrmOrganizationProjectRepository } from '../../organization-project/repository/type-orm-organization-project.repository';
export declare class ActivityService extends TenantAwareCrudService<Activity> {
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository;
    readonly commandBus: CommandBus;
    constructor(typeOrmActivityRepository: TypeOrmActivityRepository, mikroOrmActivityRepository: MikroOrmActivityRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository, commandBus: CommandBus);
    getDailyActivities(request: IGetActivitiesInput): Promise<IDailyActivity[]>;
    getDailyActivitiesReport(request: IGetActivitiesInput): Promise<IActivity[]>;
    getActivities(request: IGetActivitiesInput): Promise<IActivity[]>;
    bulkSave(input: IBulkActivitiesInput): Promise<any>;
    private filterQuery;
}
