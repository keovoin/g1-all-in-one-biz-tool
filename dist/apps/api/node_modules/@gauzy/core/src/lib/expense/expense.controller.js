"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("../core/crud");
const employee_service_1 = require("../employee/employee.service");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const commands_1 = require("./commands");
const expense_entity_1 = require("./expense.entity");
const expense_service_1 = require("./expense.service");
const context_1 = require("../core/context");
const queries_1 = require("./queries");
const pipes_1 = require("./../shared/pipes");
const expense_map_service_1 = require("./expense.map.service");
const dto_1 = require("./dto");
const query_1 = require("./dto/query");
let ExpenseController = class ExpenseController extends crud_1.CrudController {
    constructor(expenseService, expenseMapService, employeeService, commandBus, queryBus) {
        super(expenseService);
        this.expenseService = expenseService;
        this.expenseMapService = expenseMapService;
        this.employeeService = employeeService;
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * GET expense count
     *
     * @param options
     * @returns
     */
    async getCount(options) {
        return await this.expenseService.countBy(options);
    }
    /**
     * GET expense for same tenant
     *
     * @param options
     * @returns
     */
    async pagination(params) {
        return this.expenseService.pagination(params);
    }
    // If user is not an employee, then this will return 404
    async findMyExpenseWithSplitIncluded(data) {
        const { relations, filterDate } = data;
        const employee = await this.employeeService.findOneByWhereOptions({
            userId: context_1.RequestContext.currentUserId()
        });
        return await this.queryBus.execute(new queries_1.FindSplitExpenseQuery({
            employeeId: employee.id,
            relations,
            filterDate
        }));
    }
    async findAllSplitExpenses(data, employeeId) {
        const { relations, filterDate } = data;
        return await this.queryBus.execute(new queries_1.FindSplitExpenseQuery({
            employeeId,
            relations,
            filterDate
        }));
    }
    async getExpenseReport(options) {
        const expenses = await this.expenseService.getExpense(options);
        let response = [];
        if (options.groupBy === contracts_1.ReportGroupFilterEnum.date) {
            response = this.expenseMapService.mapByDate(expenses);
        }
        else if (options.groupBy === contracts_1.ReportGroupFilterEnum.employee) {
            response = this.expenseMapService.mapByEmployee(expenses);
        }
        else if (options.groupBy === contracts_1.ReportGroupFilterEnum.project) {
            response = this.expenseMapService.mapByProject(expenses);
        }
        return response;
    }
    async getDailyReportChartData(options) {
        return this.expenseService.getDailyReportChartData(options);
    }
    async findAll(data) {
        const { relations, findInput, filterDate } = data;
        return this.expenseService.findAllExpenses({ where: findInput, relations }, filterDate);
    }
    /**
     * Find expense by primary ID
     *
     * @param id
     * @returns
     */
    async findById(id) {
        return await this.expenseService.findOneByIdString(id);
    }
    /**
     * Create Expense
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.ExpenseCreateCommand(entity));
    }
    /**
     * Update Expense
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ExpenseUpdateCommand(id, entity));
    }
    /**
     * Delete Expense
     *
     * @param expenseId
     * @param options
     * @returns
     */
    async delete(expenseId, options) {
        return await this.commandBus.execute(new commands_1.ExpenseDeleteCommand(options.employeeId, expenseId));
    }
};
exports.ExpenseController = ExpenseController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('count'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "getCount", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all expense for the logged in employee, including split expenses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found expense',
        type: expense_entity_1.Expense
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('me'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "findMyExpenseWithSplitIncluded", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all expenses for an employee, including split expenses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found split expenses'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('include-split/:employeeId'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__param(1, (0, common_1.Param)('employeeId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "findAllSplitExpenses", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all expenses for an employee, including split expenses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found split expenses'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('report'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.ExpenseReportQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "getExpenseReport", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Report daily chart' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found one record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('report/daily-chart'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [query_1.ExpenseReportQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "getDailyReportChartData", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all expense.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found expense',
        type: expense_entity_1.Expense
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "findById", null);
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
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateExpenseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "create", null);
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
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateExpenseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "update", null);
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
    (0, common_1.Delete)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.DeleteExpenseDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseController.prototype, "delete", null);
exports.ExpenseController = ExpenseController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Expense'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_EDIT),
    (0, common_1.Controller)('/expense'),
    tslib_1.__metadata("design:paramtypes", [expense_service_1.ExpenseService,
        expense_map_service_1.ExpenseMapService,
        employee_service_1.EmployeeService,
        cqrs_1.CommandBus,
        cqrs_1.QueryBus])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map