"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAwardController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const employee_award_entity_1 = require("./employee-award.entity");
const employee_award_service_1 = require("./employee-award.service");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let EmployeeAwardController = class EmployeeAwardController extends crud_1.CrudController {
    constructor(employeeAwardService) {
        super(employeeAwardService);
        this.employeeAwardService = employeeAwardService;
    }
    async findAll(params) {
        return await this.employeeAwardService.findAll({
            where: params.where
        });
    }
    async create(entity) {
        return await this.employeeAwardService.create(entity);
    }
    async update(id, entity) {
        return await this.employeeAwardService.update(id, entity);
    }
    async delete(id) {
        return await this.employeeAwardService.delete(id);
    }
};
exports.EmployeeAwardController = EmployeeAwardController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find Employee Awards.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found Employee Awards',
        type: employee_award_entity_1.EmployeeAward
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
], EmployeeAwardController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateEmployeeAwardDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAwardController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
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
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, dto_1.UpdateEmployeeAwardDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAwardController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeAwardController.prototype, "delete", null);
exports.EmployeeAwardController = EmployeeAwardController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeAward'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.PUBLIC_PAGE_EDIT, contracts_1.PermissionsEnum.ALL_ORG_EDIT),
    (0, common_1.Controller)('/employee-award'),
    tslib_1.__metadata("design:paramtypes", [employee_award_service_1.EmployeeAwardService])
], EmployeeAwardController);
//# sourceMappingURL=employee-award.controller.js.map