import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { ID, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { EmployeeNotificationSetting } from './employee-notification-setting.entity';
import { EmployeeNotificationSettingService } from './employee-notification-setting.service';
import { CreateEmployeeNotificationSettingDTO, UpdateEmployeeNotificationSettingDTO } from './dto';
export declare class EmployeeNotificationSettingController extends CrudController<EmployeeNotificationSetting> {
    protected readonly _employeeNotificationSettingService: EmployeeNotificationSettingService;
    private readonly _commandBus;
    constructor(_employeeNotificationSettingService: EmployeeNotificationSettingService, _commandBus: CommandBus);
    /**
     * Retrieves paginated employee notification settings.
     *
     * This endpoint returns a list of employee notification settings based on the provided pagination parameters.
     * The query parameters are defined by `BaseQueryDTO<EmployeeNotificationSetting>`, and the response is
     * a paginated object containing employee notification settings.
     *
     * @param {BaseQueryDTO<EmployeeNotificationSetting>} params - The pagination and filter parameters.
     * @returns {Promise<IPagination<EmployeeNotificationSetting>>} A promise that resolves to the paginated employee notification settings.
     */
    findAll(params: BaseQueryDTO<EmployeeNotificationSetting>): Promise<IPagination<EmployeeNotificationSetting>>;
    /**
     * Retrieves a single employee notification setting by its unique identifier.
     *
     * @param {ID} id - The UUID of the employee notification setting.
     * @param {BaseQueryDTO<EmployeeNotificationSetting>} params - Additional query parameters for pagination.
     * @returns {Promise<EmployeeNotificationSetting>} The employee notification setting if found.
     */
    findById(id: ID, params: BaseQueryDTO<EmployeeNotificationSetting>): Promise<EmployeeNotificationSetting>;
    /**
     * Creates a new employee notification setting.
     *
     * Accepts a data transfer object containing the necessary details for creating a notification setting,
     * validates the input, and dispatches a command to persist the new setting.
     *
     * @param {CreateEmployeeNotificationSettingDTO} entity - The data for creating the employee notification setting.
     * @returns {Promise<EmployeeNotificationSetting>} A promise that resolves to the newly created notification setting.
     */
    create(entity: CreateEmployeeNotificationSettingDTO): Promise<EmployeeNotificationSetting>;
    /**
     * Updates an existing employee notification setting.
     *
     * This endpoint validates the provided ID and update data before dispatching an update command
     * via the command bus. If the operation is successful, it returns the updated employee notification setting.
     *
     * @param {ID} id - The UUID of the employee notification setting to update.
     * @param {UpdateEmployeeNotificationSettingDTO} entity - The data transfer object containing the update details.
     * @returns {Promise<EmployeeNotificationSetting>} A promise that resolves to the updated employee notification setting.
     */
    update(id: ID, entity: UpdateEmployeeNotificationSettingDTO): Promise<EmployeeNotificationSetting>;
    /**
     * Deletes an employee notification setting by its unique identifier.
     *
     * @param {ID} id - The UUID of the employee notification setting to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     */
    delete(id: ID): Promise<DeleteResult>;
}
