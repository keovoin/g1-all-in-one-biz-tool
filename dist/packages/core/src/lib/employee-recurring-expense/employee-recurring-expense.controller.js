"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
const employee_recurring_expense_query_dto_1 = require("./dto/employee-recurring-expense-query.dto");
const employee_recurring_expense_entity_1 = require("./employee-recurring-expense.entity");
const employee_recurring_expense_service_1 = require("./employee-recurring-expense.service");
const queries_1 = require("./queries");
let EmployeeRecurringExpenseController = class EmployeeRecurringExpenseController extends crud_1.CrudController {
    constructor(employeeRecurringExpenseService, queryBus, commandBus) {
        super(employeeRecurringExpenseService);
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
        this.queryBus = queryBus;
        this.commandBus = commandBus;
    }
    async findAllByMonth(options) {
        return await this.queryBus.execute(new queries_1.EmployeeRecurringExpenseByMonthQuery(options, options.relations));
    }
    async findStartDateUpdateType(data) {
        const { findInput } = data;
        return this.queryBus.execute(new queries_1.EmployeeRecurringExpenseStartDateUpdateTypeQuery(findInput));
    }
    async findAll(params) {
        try {
            return this.employeeRecurringExpenseService.findAll({
                ...(params && params.relations
                    ? {
                        relations: params.relations
                    }
                    : {}),
                ...(params && params.where
                    ? {
                        where: params.where
                    }
                    : {}),
                ...(params && params.order
                    ? {
                        order: params.order
                    }
                    : {})
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async create(entity) {
        return await this.commandBus.execute(new commands_1.EmployeeRecurringExpenseCreateCommand(entity));
    }
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.EmployeeRecurringExpenseEditCommand(id, entity));
    }
    async delete(id, data) {
        const { deleteInput } = data;
        return await this.commandBus.execute(new commands_1.EmployeeRecurringExpenseDeleteCommand(id, deleteInput));
    }
};
exports.EmployeeRecurringExpenseController = EmployeeRecurringExpenseController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all employee recurring expense by month.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee recurring expense by month',
        type: employee_recurring_expense_entity_1.EmployeeRecurringExpense
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_VIEW),
    (0, common_1.Get)('month'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_query_dto_1.EmployeeRecurringExpenseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecurringExpenseController.prototype, "findAllByMonth", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find the start date update type for a recurring expense.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found start date update type'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_VIEW),
    (0, common_1.Get)('date-update-type'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecurringExpenseController.prototype, "findStartDateUpdateType", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all employee recurring expenses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found employee recurring expense',
        type: employee_recurring_expense_entity_1.EmployeeRecurringExpense
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_VIEW),
    (0, common_1.Get)(),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecurringExpenseController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new expense' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The expense has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateEmployeeRecurringExpenseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecurringExpenseController.prototype, "create", null);
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
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateEmployeeRecurringExpenseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecurringExpenseController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The record has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EmployeeRecurringExpenseController.prototype, "delete", null);
exports.EmployeeRecurringExpenseController = EmployeeRecurringExpenseController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EmployeeRecurringExpense'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EMPLOYEE_EXPENSES_EDIT),
    (0, common_1.Controller)('/employee-recurring-expense'),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_service_1.EmployeeRecurringExpenseService,
        cqrs_1.QueryBus,
        cqrs_1.CommandBus])
], EmployeeRecurringExpenseController);
//# sourceMappingURL=employee-recurring-expense.controller.js.map