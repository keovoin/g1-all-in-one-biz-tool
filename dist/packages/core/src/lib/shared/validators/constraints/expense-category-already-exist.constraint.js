"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryAlreadyExistConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const context_1 = require("../../../core/context");
const utils_1 = require("../../../core/utils");
const type_orm_expense_category_repository_1 = require("../../../expense-categories/repository/type-orm-expense-category.repository");
const mikro_orm_expense_category_repository_1 = require("../../../expense-categories/repository/mikro-orm-expense-category.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_1.getORMType)();
/**
 * Expense category already existed validation constraint
 *
 * @param validationOptions
 * @returns
 */
let ExpenseCategoryAlreadyExistConstraint = class ExpenseCategoryAlreadyExistConstraint {
    constructor(typeOrmExpenseCategoryRepository, mikroOrmExpenseCategoryRepository) {
        this.typeOrmExpenseCategoryRepository = typeOrmExpenseCategoryRepository;
        this.mikroOrmExpenseCategoryRepository = mikroOrmExpenseCategoryRepository;
    }
    /**
     * Validates if a given name for an expense category is unique within the specified organization.
     *
     * @param name - The name of the expense category to validate.
     * @param args - Validation arguments containing additional contextual information.
     * @returns True if the name is unique (or in the case of an update, not matching any other than itself), otherwise false.
     */
    async validate(name, args) {
        const object = args.object;
        const organizationId = object.organizationId || object.organization?.id;
        if (!organizationId)
            return true; // Validation passes if there's no organization context
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            // Convert the name to lowercase for case-insensitive comparison
            const normalizedName = name.toLowerCase();
            const queryConditions = { name: normalizedName, organizationId, tenantId };
            if (args.targetName === 'UpdateExpenseCategoryDTO' && object.id) {
                queryConditions['id'] = (0, typeorm_1.Not)(object.id); // Exclude current category from the check
            }
            switch (ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    return !(await this.mikroOrmExpenseCategoryRepository.findOneOrFail({
                        ...queryConditions,
                        name: { $ilike: normalizedName }
                    }));
                case utils_1.MultiORMEnum.TypeORM:
                    return !(await this.typeOrmExpenseCategoryRepository.findOneByOrFail({
                        ...queryConditions,
                        name: (0, typeorm_1.ILike)(normalizedName)
                    }));
                default:
                    throw new Error(`Not implemented for ${ormType}`);
            }
        }
        catch (error) {
            // Consider logging or handling different types of errors explicitly
            return true; // Name doesn't exist, validation passes
        }
    }
    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `The category '${value}' already exists. Please choose a different name for the new category.`;
    }
};
exports.ExpenseCategoryAlreadyExistConstraint = ExpenseCategoryAlreadyExistConstraint;
exports.ExpenseCategoryAlreadyExistConstraint = ExpenseCategoryAlreadyExistConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsExpenseCategoryAlreadyExist', async: true }),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_expense_category_repository_1.TypeOrmExpenseCategoryRepository,
        mikro_orm_expense_category_repository_1.MikroOrmExpenseCategoryRepository])
], ExpenseCategoryAlreadyExistConstraint);
//# sourceMappingURL=expense-category-already-exist.constraint.js.map