"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSettingsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const update_document_settings_command_1 = require("../commands/update-document-settings.command");
const document_settings_dto_1 = require("../dto/document-settings.dto");
const get_document_settings_query_1 = require("../queries/get-document-settings.query");
let DocumentSettingsController = class DocumentSettingsController {
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    /**
     * Org defaults + read-only deployment capabilities.
     */
    async getSettings(query) {
        return this.queryBus.execute(new get_document_settings_query_1.GetDocumentSettingsQuery(query?.organizationId ?? core_1.RequestContext.currentOrganizationId()));
    }
    /**
     * Partial update of the org-defaults block only (`capabilities` is never writable).
     */
    async updateSettings(input, query) {
        return this.commandBus.execute(new update_document_settings_command_1.UpdateDocumentSettingsCommand(query?.organizationId ?? core_1.RequestContext.currentOrganizationId(), input));
    }
};
exports.DocumentSettingsController = DocumentSettingsController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get the Documents org defaults and deployment capabilities.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Settings retrieved successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_READ),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_settings_dto_1.DocumentSettingsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentSettingsController.prototype, "getSettings", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update the Documents org defaults.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Settings updated successfully.' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.DOCS_MANAGE),
    (0, core_1.UseValidationPipe)({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    (0, common_1.Put)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [document_settings_dto_1.DocumentSettingsDTO,
        document_settings_dto_1.DocumentSettingsQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], DocumentSettingsController.prototype, "updateSettings", null);
exports.DocumentSettingsController = DocumentSettingsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Documents Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard, core_1.FeatureFlagGuard),
    (0, common_2.FeatureFlag)(contracts_1.FeatureEnum.FEATURE_DOCUMENTS),
    (0, common_1.Controller)('/plugins/docs/settings'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus, cqrs_1.QueryBus])
], DocumentSettingsController);
//# sourceMappingURL=document-settings.controller.js.map