"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoriesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const expense_categories_service_1 = require("./expense-categories.service");
const dto_1 = require("./dto");
const commands_1 = require("./commands");
let ExpenseCategoriesController = class ExpenseCategoriesController extends crud_1.CrudController {
    constructor(_expenseCategoriesService, _commandBus) {
        super(_expenseCategoriesService);
        this._expenseCategoriesService = _expenseCategoriesService;
        this._commandBus = _commandBus;
    }
    /**
     * Retrieves a paginated list of all expense categories.
     *
     * @param {BaseQueryDTO<ExpenseCategory>} options - Pagination options.
     * @returns {Promise<IPagination<IExpenseCategory>>} - Paginated expense category data.
     *
     * @example
     * ```ts
     * GET /expense-categories/pagination?page=1&limit=10
     * ```
     */
    async pagination(options) {
        return this._expenseCategoriesService.paginate(options);
    }
    /**
     * Retrieves a list of all expense categories.
     *
     * @param {BaseQueryDTO<ExpenseCategory>} options - Query parameters for filtering expense categories.
     * @returns {Promise<IPagination<IExpenseCategory>>} - List of expense categories.
     *
     * @example
     * ```ts
     * GET /expense-categories
     * ```
     */
    async findAll(options) {
        return await this._expenseCategoriesService.findAll(options);
    }
    /**
     * Creates a new expense category.
     *
     * @param {CreateExpenseCategoryDTO} entity - The DTO containing expense category details.
     * @returns {Promise<IExpenseCategory>} - The created expense category.
     *
     * @example
     * ```ts
     * POST /expense-categories
     * {
     *   "name": "Office Supplies",
     *   "description": "Expenses related to office supplies"
     * }
     * ```
     */
    async create(entity) {
        return await this._commandBus.execute(new commands_1.ExpenseCategoryCreateCommand(entity));
    }
    /**
     * Updates an existing expense category by its ID.
     *
     * @param {ID} id - The unique identifier of the expense category.
     * @param {UpdateExpenseCategoryDTO} entity - The DTO containing updated expense category details.
     * @returns {Promise<IExpenseCategory>} - The updated expense category.
     *
     * @example
     * ```ts
     * PUT /expense-categories/123e4567-e89b-12d3-a456-426614174000
     * {
     *   "name": "Updated Category",
     *   "description": "Updated category description"
     * }
     * ```
     */
    async update(id, entity) {
        return await this._commandBus.execute(new commands_1.ExpenseCategoryUpdateCommand(id, entity));
    }
};
exports.ExpenseCategoriesController = ExpenseCategoriesController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all expense categories with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved paginated expense categories' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseCategoriesController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all expense categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully retrieved all expense categories' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseCategoriesController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new expense category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Expense category successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateExpenseCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseCategoriesController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an expense category by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Expense category successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Expense category not found' }),
    (0, common_1.Put)(':id'),
    (0, pipes_1.UseValidationPipe)({ transform: true, whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateExpenseCategoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ExpenseCategoriesController.prototype, "update", null);
exports.ExpenseCategoriesController = ExpenseCategoriesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ExpenseCategories'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EXPENSES_EDIT),
    (0, common_1.Controller)('/expense-categories'),
    tslib_1.__metadata("design:paramtypes", [expense_categories_service_1.ExpenseCategoriesService,
        cqrs_1.CommandBus])
], ExpenseCategoriesController);
//# sourceMappingURL=expense-categories.controller.js.map