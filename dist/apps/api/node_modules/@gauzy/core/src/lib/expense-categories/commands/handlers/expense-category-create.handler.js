"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoryCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const expense_category_create_command_1 = require("./../expense-category-create.command");
const expense_categories_service_1 = require("./../../expense-categories.service");
let ExpenseCategoryCreateHandler = class ExpenseCategoryCreateHandler {
    constructor(_expenseCategoryService) {
        this._expenseCategoryService = _expenseCategoryService;
    }
    async execute(command) {
        const { input } = command;
        try {
            return await this._expenseCategoryService.create(input);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.ExpenseCategoryCreateHandler = ExpenseCategoryCreateHandler;
exports.ExpenseCategoryCreateHandler = ExpenseCategoryCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(expense_category_create_command_1.ExpenseCategoryCreateCommand),
    tslib_1.__metadata("design:paramtypes", [expense_categories_service_1.ExpenseCategoriesService])
], ExpenseCategoryCreateHandler);
//# sourceMappingURL=expense-category-create.handler.js.map