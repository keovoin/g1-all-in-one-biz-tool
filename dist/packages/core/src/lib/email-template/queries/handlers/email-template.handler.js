"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateQueryHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const email_template_service_1 = require("./../../email-template.service");
const email_template_query_1 = require("../email-template.query");
let EmailTemplateQueryHandler = class EmailTemplateQueryHandler {
    constructor(emailTemplateService) {
        this.emailTemplateService = emailTemplateService;
    }
    async execute(query) {
        const { options } = query;
        return await this.emailTemplateService.findAll(options);
    }
};
exports.EmailTemplateQueryHandler = EmailTemplateQueryHandler;
exports.EmailTemplateQueryHandler = EmailTemplateQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(email_template_query_1.EmailTemplateQuery),
    tslib_1.__metadata("design:paramtypes", [email_template_service_1.EmailTemplateService])
], EmailTemplateQueryHandler);
//# sourceMappingURL=email-template.handler.js.map