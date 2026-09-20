import { CommandBus } from '@nestjs/cqrs';
import { ID, IExpenseCategory, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { ExpenseCategoriesService } from './expense-categories.service';
import { ExpenseCategory } from './expense-category.entity';
import { CreateExpenseCategoryDTO, UpdateExpenseCategoryDTO } from './dto';
export declare class ExpenseCategoriesController extends CrudController<ExpenseCategory> {
    private readonly _expenseCategoriesService;
    private readonly _commandBus;
    constructor(_expenseCategoriesService: ExpenseCategoriesService, _commandBus: CommandBus);
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
    pagination(options: BaseQueryDTO<ExpenseCategory>): Promise<IPagination<IExpenseCategory>>;
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
    findAll(options: BaseQueryDTO<ExpenseCategory>): Promise<IPagination<IExpenseCategory>>;
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
    create(entity: CreateExpenseCategoryDTO): Promise<IExpenseCategory>;
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
    update(id: ID, entity: UpdateExpenseCategoryDTO): Promise<IExpenseCategory>;
}
