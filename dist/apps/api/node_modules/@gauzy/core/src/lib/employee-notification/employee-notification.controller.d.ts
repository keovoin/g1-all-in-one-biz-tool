import { ID, IEmployeeNotification, IMarkAllAsReadResponse, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { EmployeeNotificationService } from './employee-notification.service';
import { EmployeeNotification } from './employee-notification.entity';
export declare class EmployeeNotificationController extends CrudController<EmployeeNotification> {
    readonly _employeeNotificationService: EmployeeNotificationService;
    constructor(_employeeNotificationService: EmployeeNotificationService);
    /**
     * Retrieves a paginated list of employee notifications.
     *
     * @param {BaseQueryDTO<EmployeeNotification>} params - The query parameters for pagination.
     * @returns {Promise<IPagination<EmployeeNotification>>} A promise that resolves to the paginated notifications.
     */
    findAll(params: BaseQueryDTO<EmployeeNotification>): Promise<IPagination<IEmployeeNotification>>;
    /**
     * Retrieves an employee notification by its unique identifier.
     *
     * @param {ID} id - The UUID of the employee notification.
     * @param {BaseQueryDTO<EmployeeNotification>} params - Additional query parameters.
     * @returns {Promise<EmployeeNotification>} A promise that resolves to the found notification.
     */
    findById(id: ID, params: BaseQueryDTO<EmployeeNotification>): Promise<IEmployeeNotification>;
    /**
     * Marks all employee notifications as read.
     *
     * @returns {Promise<any>} A promise that resolves to the result of marking notifications as read.
     */
    markAllAsRead(): Promise<IMarkAllAsReadResponse>;
}
