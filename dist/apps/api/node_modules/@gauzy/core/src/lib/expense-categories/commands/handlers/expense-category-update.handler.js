"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const expense_category_update_command_1 = require("./../expense-category-update.command");
const expense_categories_service_1 = require("./../../expense-categories.service");
let ExpenseCategoryUpdateHandler = class ExpenseCategoryUpdateHandler {
    constructor(_expenseCategoryService) {
        this._expenseCategoryService = _expenseCategoryService;
    }
    async execute(command) {
        const { id, input } = command;
        try {
            return await this._expenseCategoryService.create({ ...input, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ExpenseCategoryUpdateHandler = ExpenseCategoryUpdateHandler;
exports.ExpenseCategoryUpdateHandler = ExpenseCategoryUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(expense_category_update_command_1.ExpenseCategoryUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [expense_categories_service_1.ExpenseCategoriesService])
], ExpenseCategoryUpdateHandler);
//# sourceMappingURL=expense-category-update.handler.js.map