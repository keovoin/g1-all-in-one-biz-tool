"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryFirstOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const expense_category_first_or_create_command_1 = require("./../expense-category-first-or-create.command");
const expense_categories_service_1 = require("./../../expense-categories.service");
const context_1 = require("../../../core/context");
const expense_category_create_command_1 = require("../expense-category-create.command");
let ExpenseCategoryFirstOrCreateHandler = class ExpenseCategoryFirstOrCreateHandler {
    constructor(_expenseCategoryService, _commandBus) {
        this._expenseCategoryService = _expenseCategoryService;
        this._commandBus = _commandBus;
    }
    async execute(command) {
        const { input } = command;
        try {
            const { organizationId, name } = input;
            const tenantId = context_1.RequestContext.currentTenantId();
            return await this._expenseCategoryService.findOneByWhereOptions({
                tenantId,
                organizationId,
                name
            });
        }
        catch (error) {
            return await this._commandBus.execute(new expense_category_create_command_1.ExpenseCategoryCreateCommand(input));
        }
    }
};
exports.ExpenseCategoryFirstOrCreateHandler = ExpenseCategoryFirstOrCreateHandler;
exports.ExpenseCategoryFirstOrCreateHandler = ExpenseCategoryFirstOrCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(expense_category_first_or_create_command_1.ExpenseCategoryFirstOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [expense_categories_service_1.ExpenseCategoriesService,
        cqrs_1.CommandBus])
], ExpenseCategoryFirstOrCreateHandler);
//# sourceMappingURL=expense-category-first-or-create.handler.js.map