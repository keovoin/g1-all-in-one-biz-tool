"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationSettingController = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const crud_1 = require("../core/crud");
const employee_notification_setting_entity_1 = require("./employee-notification-setting.entity");
const employee_notification_setting_service_1 = require("./employee-notification-setting.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let EmployeeNotificationSettingController = class EmployeeNotificationSettingController extends crud_1.CrudController {
    constructor(_employeeNotificationSettingService, _commandBus) {
        super(_employeeNotificationSettingService);
        this._employeeNotificationSettingService = _employeeNotificationSettingService;
        this._commandBus = _commandBus;
    }
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
    async findAll(params) {
        return this._employeeNotificationSettingService.findAll(params);
    }
    /**
     * Retrieves a single employee notification setting by its unique identifier.
     *
     * @param {ID} id - The UUID of the employee notification setting.
     * @param {BaseQueryDTO<EmployeeNotificationSetting>} params - Additional query parameters for pagination.
     * @returns {Promise<EmployeeNotificationSetting>} The employee notification setting if found.
     */
    async findById(id, params) {
        return this._employeeNotificationSettingService.findOneByIdString(id, params);
    }
    /**
     * Creates a new employee notification setting.
     *
     * Accepts a data transfer object containing the necessary details for creating a notification setting,
     * validates the input, and dispatches a command to persist the new setting.
     *
     * @param {CreateEmployeeNotificationSettingDTO} entity - The data for creating the employee notification setting.
     * @returns {Promise<EmployeeNotificationSetting>} A promise that resolves to the newly created notification setting.
     */
    async create(entity) {
        return await this._commandBus.execute(new commands_1.EmployeeNotificationSettingCreateCommand(entity));
    }
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
    async update(id, entity) {
        return await this._commandBus.execute(new commands_1.EmployeeNotificationSettingUpdateCommand(id, entity));
    }
    /**
     * Deletes an employee notification setting by its unique identifier.
     *
     * @param {ID} id - The UUID of the employee notification setting to delete.
     * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
     */
    async delete(id) {
        return await this._employeeNotificationSettingService.delete(id);
    }
};
exports.EmployeeNotificationSettingController = EmployeeNotificationSettingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get employees notification settings.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee notification settings',
        type: employee_notification_setting_entity_1.EmployeeNotificationSetting
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Records not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationSettingController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee notification setting',
        type: employee_notification_setting_entity_1.EmployeeNotificationSetting
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationSettingController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create employee notification setting.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateEmployeeNotificationSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationSettingController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update employee notification setting.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateEmployeeNotificationSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationSettingController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete employee notification setting.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeNotificationSettingController.prototype, "delete", null);
exports.EmployeeNotificationSettingController = EmployeeNotificationSettingController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(),
    (0, common_1.Controller)('/employee-notification-setting'),
    tslib_1.__metadata("design:paramtypes", [employee_notification_setting_service_1.EmployeeNotificationSettingService,
        cqrs_1.CommandBus])
], EmployeeNotificationSettingController);
//# sourceMappingURL=employee-notification-setting.controller.js.map