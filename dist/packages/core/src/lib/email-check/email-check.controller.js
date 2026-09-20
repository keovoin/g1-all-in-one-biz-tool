"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCheckController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const api_key_auth_guard_1 = require("../shared/guards/api-key-auth.guard");
const check_email_dto_1 = require("./dto/check-email.dto");
const email_check_service_1 = require("./email-check.service");
let EmailCheckController = class EmailCheckController {
    constructor(emailCheckService) {
        this.emailCheckService = emailCheckService;
    }
    /**
     * Checks if the provided email exists in the database.
     *
     * @param query - An object containing the email address to check.
     * @returns A promise resolving to an object `{ exists: boolean }`, indicating whether the email exists.
     */
    async checkEmail(query) {
        const exists = await this.emailCheckService.doesEmailExist(query.email);
        return { exists };
    }
};
exports.EmailCheckController = EmailCheckController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if an email exists in the database' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email existence checked', schema: { example: { exists: true } } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid email format or missing email' }),
    (0, common_2.Public)(),
    (0, common_1.Post)('/email-check'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [check_email_dto_1.CheckEmailDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EmailCheckController.prototype, "checkEmail", null);
exports.EmailCheckController = EmailCheckController = tslib_1.__decorate([
    (0, common_1.Controller)('/auth'),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard) // Protect API with API Key & Secret authentication
    ,
    tslib_1.__metadata("design:paramtypes", [email_check_service_1.EmailCheckService])
], EmailCheckController);
//# sourceMappingURL=email-check.controller.js.map