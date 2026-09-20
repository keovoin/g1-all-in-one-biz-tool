import { EntityRepositoryType } from '@mikro-orm/core';
import { IEmployeeSetting, IEmployee, EmployeeSettingTypeEnum, ID, BaseEntityEnum, JsonData } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { MikroOrmEmployeeSettingRepository } from './repository/mikro-orm-employee-setting.repository';
export declare class EmployeeSetting extends TenantOrganizationBaseEntity implements IEmployeeSetting {
    [EntityRepositoryType]?: MikroOrmEmployeeSettingRepository;
    settingType?: EmployeeSettingTypeEnum;
    entityId?: ID;
    entity?: BaseEntityEnum;
    data?: JsonData;
    defaultData?: JsonData;
    employee: IEmployee;
    employeeId: ID;
}
