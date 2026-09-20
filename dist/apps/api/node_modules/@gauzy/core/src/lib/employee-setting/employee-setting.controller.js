"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSettingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const pipes_1 = require("../shared/pipes");
const guards_1 = require("./../shared/guards");
const crud_1 = require("./../core/crud");
const employee_setting_service_1 = require("./employee-setting.service");
const employee_setting_entity_1 = require("./employee-setting.entity");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let EmployeeSettingController = class EmployeeSettingController extends crud_1.CrudController {
    constructor(employeeSettingService, commandBus) {
        super(employeeSettingService);
        this.employeeSettingService = employeeSettingService;
        this.commandBus = commandBus;
    }
    async findAll(params) {
        return await this.employeeSettingService.findAll(params);
    }
    async findById(id, params) {
        return this.employeeSettingService.findOneByIdString(id, params);
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.EmployeeSettingCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.EmployeeSettingUpdateCommand(id, entity));
    }
    async delete(id) {
        return await this.employeeSettingService.delete(id);
    }
};
exports.EmployeeSettingController = EmployeeSettingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all employee settings'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee settings',
        type: employee_setting_entity_1.EmployeeSetting
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeSettingController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, crud_1.FindOptionsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeSettingController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Employee Setting' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateEmployeeSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeSettingController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing employee setting' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
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
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateEmployeeSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeSettingController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete Employee Setting' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeSettingController.prototype, "delete", null);
exports.EmployeeSettingController = EmployeeSettingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeSetting'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/employee-settings'),
    tslib_1.__metadata("design:paramtypes", [employee_setting_service_1.EmployeeSettingService,
        cqrs_1.CommandBus])
], EmployeeSettingController);
//# sourceMappingURL=employee-setting.controller.js.map