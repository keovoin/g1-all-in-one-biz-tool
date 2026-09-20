import { ID, IEmployeeSetting, IEmployeeSettingCreateInput, IEmployeeSettingUpdateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { EmployeeSetting } from './employee-setting.entity';
import { TypeOrmEmployeeSettingRepository } from './repository/type-orm-employee-setting.repository';
import { MikroOrmEmployeeSettingRepository } from './repository/mikro-orm-employee-setting.repository';
export declare class EmployeeSettingService extends TenantAwareCrudService<EmployeeSetting> {
    constructor(typeOrmEmployeeSettingRepository: TypeOrmEmployeeSettingRepository, mikroOrmEmployeeSettingRepository: MikroOrmEmployeeSettingRepository);
    /**
     * Creates or updates an EmployeeSetting.
     * If an existing EmployeeSetting is found with matching criteria, it updates the existing record.
     * Otherwise, it creates a new record.
     *
     * @param {IEmployeeSettingCreateInput} input - The input data for creating an EmployeeSetting.
     * @returns {Promise<IEmployeeSetting>} A promise that resolves to the created or updated EmployeeSetting.
     * @throws {BadRequestException} If an error occurs during the process.
     */
    create(input: IEmployeeSettingCreateInput): Promise<IEmployeeSetting>;
    /**
     * Updates an existing EmployeeSetting.
     *
     * @param {ID} id - The unique identifier of the EmployeeSetting to update.
     * @param {IEmployeeSettingUpdateInput} input - The input data containing the updated properties for the EmployeeSetting.
     * @returns {Promise<IEmployeeSetting>} A promise that resolves to the updated EmployeeSetting.
     * @throws {BadRequestException} If the EmployeeSetting is not found or the update fails.
     */
    update(id: ID, input: IEmployeeSettingUpdateInput): Promise<IEmployeeSetting>;
}
