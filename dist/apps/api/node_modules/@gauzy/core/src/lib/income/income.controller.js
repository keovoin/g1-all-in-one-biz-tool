"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../core/context");
const crud_1 = require("./../core/crud");
const employee_service_1 = require("../employee/employee.service");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
const income_entity_1 = require("./income.entity");
const income_service_1 = require("./income.service");
const dto_1 = require("./dto");
let IncomeController = class IncomeController extends crud_1.CrudController {
    constructor(incomeService, employeeService, commandBus) {
        super(incomeService);
        this.incomeService = incomeService;
        this.employeeService = employeeService;
        this.commandBus = commandBus;
    }
    async findMyIncome(data) {
        const { relations, findInput, filterDate } = data;
        //If user is not an employee, then this will return 404
        const employee = await this.employeeService.findOneByWhereOptions({
            userId: context_1.RequestContext.currentUserId()
        });
        return this.incomeService.findAllIncomes({ where: { ...findInput, employeeId: employee.id }, relations }, filterDate);
    }
    /**
     * GET income count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.incomeService.countBy(options);
    }
    async pagination(params) {
        return await this.incomeService.pagination(params);
    }
    async findAll(data) {
        const { relations, findInput, filterDate } = data;
        return this.incomeService.findAllIncomes({ where: findInput, relations }, filterDate);
    }
    /**
     * Find income by primary ID
     *
     * @param id
     * @returns
     */
    async findById(id) {
        return await this.incomeService.findOneByIdString(id);
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.IncomeCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.IncomeUpdateCommand(id, entity));
    }
    async delete(incomeId, options) {
        return await this.commandBus.execute(new commands_1.IncomeDeleteCommand(options.employeeId, incomeId));
    }
};
exports.IncomeController = IncomeController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all income.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found income',
        type: income_entity_1.Income
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INCOMES_VIEW),
    (0, common_1.Get)('/me'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "findMyIncome", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INCOMES_VIEW),
    (0, common_1.Get)('/count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INCOMES_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all income.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found income',
        type: income_entity_1.Income
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INCOMES_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INCOMES_VIEW),
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateIncomeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "create", null);
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
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateIncomeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)('/:id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DeleteIncomeDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IncomeController.prototype, "delete", null);
exports.IncomeController = IncomeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Income'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_INCOMES_EDIT),
    (0, common_1.Controller)('/income'),
    tslib_1.__metadata("design:paramtypes", [income_service_1.IncomeService,
        employee_service_1.EmployeeService,
        cqrs_1.CommandBus])
], IncomeController);
//# sourceMappingURL=income.controller.js.map