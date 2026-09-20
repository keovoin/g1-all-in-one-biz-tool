"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingTemplateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const accounting_template_service_1 = require("../../accounting-template.service");
const accounting_template_query_1 = require("../accounting-template.query");
let AccountingTemplateHandler = class AccountingTemplateHandler {
    constructor(accountingTemplateService) {
        this.accountingTemplateService = accountingTemplateService;
    }
    async execute(query) {
        const { options } = query;
        return await this.accountingTemplateService.findAll(options);
    }
};
exports.AccountingTemplateHandler = AccountingTemplateHandler;
exports.AccountingTemplateHandler = AccountingTemplateHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(accounting_template_query_1.AccountingTemplateQuery),
    tslib_1.__metadata("design:paramtypes", [accounting_template_service_1.AccountingTemplateService])
], AccountingTemplateHandler);
//# sourceMappingURL=accounting-template.handler.js.map