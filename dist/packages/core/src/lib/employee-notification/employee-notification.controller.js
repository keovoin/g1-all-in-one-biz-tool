"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("../core/crud");
const decorators_1 = require("../shared/decorators");
const guards_1 = require("../shared/guards");
const pipes_1 = require("../shared/pipes");
const employee_notification_service_1 = require("./employee-notification.service");
const employee_notification_entity_1 = require("./employee-notification.entity");
let EmployeeNotificationController = class EmployeeNotificationController extends crud_1.CrudController {
    constructor(_employeeNotificationService) {
        super(_employeeNotificationService);
        this._employeeNotificationService = _employeeNotificationService;
    }
    /**
     * Retrieves a paginated list of employee notifications.
     *
     * @param {BaseQueryDTO<EmployeeNotification>} params - The query parameters for pagination.
     * @returns {Promise<IPagination<EmployeeNotification>>} A promise that resolves to the paginated notifications.
     */
    async findAll(params) {
        return this._employeeNotificationService.findAll(params);
    }
    /**
     * Retrieves an employee notification by its unique identifier.
     *
     * @param {ID} id - The UUID of the employee notification.
     * @param {BaseQueryDTO<EmployeeNotification>} params - Additional query parameters.
     * @returns {Promise<EmployeeNotification>} A promise that resolves to the found notification.
     */
    async findById(id, params) {
        return this._employeeNotificationService.findOneByIdString(id, params);
    }
    /**
     * Marks all employee notifications as read.
     *
     * @returns {Promise<any>} A promise that resolves to the result of marking notifications as read.
     */
    async markAllAsRead() {
        return await this._employeeNotificationService.markAllAsRead();
    }
};
exports.EmployeeNotificationController = EmployeeNotificationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get employees notifications.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee notifications',
        type: employee_notification_entity_1.EmployeeNotification
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee notification',
        type: employee_notification_entity_1.EmployeeNotification
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/:id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The records have been successfully updated.'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)('/mark-all-read'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationController.prototype, "markAllAsRead", null);
exports.EmployeeNotificationController = EmployeeNotificationController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(),
    (0, common_1.Controller)('/employee-notification'),
    tslib_1.__metadata("design:paramtypes", [employee_notification_service_1.EmployeeNotificationService])
], EmployeeNotificationController);
//# sourceMappingURL=employee-notification.controller.js.map