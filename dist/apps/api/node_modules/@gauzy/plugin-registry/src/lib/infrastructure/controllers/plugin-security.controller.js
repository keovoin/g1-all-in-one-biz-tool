"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSecurityController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const application_1 = require("../../application");
const shared_1 = require("../../shared");
let PluginSecurityController = class PluginSecurityController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async createVerification(id, input) {
        return this.commandBus.execute(new application_1.VerifyPluginCommand(id, input));
    }
};
exports.PluginSecurityController = PluginSecurityController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create or update plugin verification' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string', format: 'uuid', description: 'Plugin ID in UUID format' }),
    (0, swagger_1.ApiBody)({ type: shared_1.VerifyPluginDTO, description: 'Verification data for the plugin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plugin verification successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plugin not found' }),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, shared_1.VerifyPluginDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], PluginSecurityController.prototype, "createVerification", null);
exports.PluginSecurityController = PluginSecurityController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Plugin Security'),
    (0, common_1.Controller)('/plugins/:id/verifications'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], PluginSecurityController);
//# sourceMappingURL=plugin-security.controller.js.map