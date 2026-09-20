import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, IEmployee, IEmployeeRecentVisit, JsonData } from '@gauzy/contracts';
import { BasePerEntityType } from '../core/entities/internal';
import { MikroOrmEmployeeRecentVisitRepository } from './repository/mikro-orm-employee-recent-visit.repository';
export declare class EmployeeRecentVisit extends BasePerEntityType implements IEmployeeRecentVisit {
    [EntityRepositoryType]?: MikroOrmEmployeeRecentVisitRepository;
    /**
     * The date and time when the employee visited the some entity.
     */
    visitedAt: Date;
    /**
     * The data associated with the some entity.
     */
    data?: JsonData;
    /**
     * The employee who recently visited the some entity.
     */
    employee?: IEmployee;
    /**
     * The ID of the employee who recently visited the some entity.
     */
    employeeId?: ID;
}
