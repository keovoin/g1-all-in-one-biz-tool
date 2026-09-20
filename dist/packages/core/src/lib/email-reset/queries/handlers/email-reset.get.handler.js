"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResetGetHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const email_reset_get_query_1 = require("../email-reset.get.query");
const email_reset_service_1 = require("../../email-reset.service");
let EmailResetGetHandler = class EmailResetGetHandler {
    constructor(_emailResetService) {
        this._emailResetService = _emailResetService;
    }
    async execute(query) {
        const { input } = query;
        try {
            return await this._emailResetService.getEmailResetIfCodeMatches(input);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
};
exports.EmailResetGetHandler = EmailResetGetHandler;
exports.EmailResetGetHandler = EmailResetGetHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(email_reset_get_query_1.EmailResetGetQuery),
    tslib_1.__metadata("design:paramtypes", [email_reset_service_1.EmailResetService])
], EmailResetGetHandler);
//# sourceMappingURL=email-reset.get.handler.js.map