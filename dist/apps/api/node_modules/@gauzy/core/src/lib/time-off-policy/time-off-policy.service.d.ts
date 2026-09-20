import { ID, ITimeOffPolicyCreateInput, ITimeOffPolicyUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud';
import { MikroOrmEmployeeRepository } from '../employee/repository/mikro-orm-employee.repository';
import { TypeOrmEmployeeRepository } from '../employee/repository/type-orm-employee.repository';
import { MikroOrmTimeOffPolicyRepository } from './repository/mikro-orm-time-off-policy.repository';
import { TypeOrmTimeOffPolicyRepository } from './repository/type-orm-time-off-policy.repository';
import { TimeOffPolicy } from './time-off-policy.entity';
export declare class TimeOffPolicyService extends TenantAwareCrudService<TimeOffPolicy> {
    readonly typeOrmTimeOffPolicyRepository: TypeOrmTimeOffPolicyRepository;
    readonly mikroOrmTimeOffPolicyRepository: MikroOrmTimeOffPolicyRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly mikroOrmEmployeeRepository: MikroOrmEmployeeRepository;
    constructor(typeOrmTimeOffPolicyRepository: TypeOrmTimeOffPolicyRepository, mikroOrmTimeOffPolicyRepository: MikroOrmTimeOffPolicyRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, mikroOrmEmployeeRepository: MikroOrmEmployeeRepository);
    /**
     * Create Time Off Policy
     *
     * @param entity
     * @returns
     */
    create(entity: ITimeOffPolicyCreateInput): Promise<TimeOffPolicy>;
    /**
     * Update Time Off Policy
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: ITimeOffPolicyUpdateInput): Promise<TimeOffPolicy>;
}
