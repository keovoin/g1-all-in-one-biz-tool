"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const organization_recurring_expense_entity_1 = require("./organization-recurring-expense.entity");
const organization_recurring_expense_service_1 = require("./organization-recurring-expense.service");
const commands_1 = require("./commands");
const queries_1 = require("./queries");
let OrganizationRecurringExpenseController = class OrganizationRecurringExpenseController extends crud_1.CrudController {
    constructor(commandBus, queryBus, organizationRecurringExpenseService) {
        super(organizationRecurringExpenseService);
        this.commandBus = commandBus;
        this.queryBus = queryBus;
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
    }
    /**
     * GET organization recurring expense by month
     *
     * @param data
     * @returns
     */
    async findAllExpenses(data) {
        const { findInput } = data;
        return this.queryBus.execute(new queries_1.OrganizationRecurringExpenseByMonthQuery(findInput));
    }
    /**
     * GET date update type & conflicting expenses
     *
     * @param data
     * @returns
     */
    async findStartDateUpdateType(data) {
        const { findInput } = data;
        return this.queryBus.execute(new queries_1.OrganizationRecurringExpenseStartDateUpdateTypeQuery(findInput));
    }
    /**
     * GET organization recurring expenses/split expense for employee
     *
     * @param data
     * @param orgId
     * @returns
     */
    async getSplitExpensesForEmployee(data, organizationId) {
        const { findInput } = data;
        return this.queryBus.execute(new queries_1.OrganizationRecurringExpenseFindSplitExpenseQuery(organizationId, findInput));
    }
    /**
     * GET all organization recurring expenses
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { findInput, order = {} } = data;
        return this.organizationRecurringExpenseService.findAll({
            where: findInput,
            order: order
        });
    }
    /**
     * CREATE organization recurring expense
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.commandBus.execute(new commands_1.OrganizationRecurringExpenseCreateCommand(entity));
    }
    /**
     * UPDATE organization recurring expense by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return this.commandBus.execute(new commands_1.OrganizationRecurringExpenseEditCommand(id, entity));
    }
    /**
     * DELETE organization recurring expense by id
     *
     * @param id
     * @param data
     * @returns
     */
    async delete(id, data) {
        const { deleteInput } = data;
        return this.commandBus.execute(new commands_1.OrganizationRecurringExpenseDeleteCommand(id, deleteInput));
    }
};
exports.OrganizationRecurringExpenseController = OrganizationRecurringExpenseController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization recurring expense by month.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization recurring expense',
        type: organization_recurring_expense_entity_1.OrganizationRecurringExpense
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/month'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationRecurringExpenseController.prototype, "findAllExpenses", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find start date update type & conflicting expenses for the update'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found start date update type'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/date-update-type'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationRecurringExpenseController.prototype, "findStartDateUpdateType", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization recurring expenses for given employee, also known as split recurring expenses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization recurring expense'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/employee/:organizationId'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__param(1, (0, common_1.Param)('organizationId', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationRecurringExpenseController.prototype, "getSplitExpensesForEmployee", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all organization recurring expenses.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found organization recurring expense',
        type: organization_recurring_expense_entity_1.OrganizationRecurringExpense
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationRecurringExpenseController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new organization recurring expense' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The organization recurring expense has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [organization_recurring_expense_entity_1.OrganizationRecurringExpense]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationRecurringExpenseController.prototype, "create", null);
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
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationRecurringExpenseController.prototype, "update", null);
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
], OrganizationRecurringExpenseController.prototype, "delete", null);
exports.OrganizationRecurringExpenseController = OrganizationRecurringExpenseController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('OrganizationRecurringExpense'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/organization-recurring-expense'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus,
        cqrs_1.QueryBus,
        organization_recurring_expense_service_1.OrganizationRecurringExpenseService])
], OrganizationRecurringExpenseController);
//# sourceMappingURL=organization-recurring-expense.controller.js.map