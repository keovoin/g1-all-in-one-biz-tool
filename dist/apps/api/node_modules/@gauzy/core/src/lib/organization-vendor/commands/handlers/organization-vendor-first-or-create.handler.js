"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVendorFirstOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("./../../../core/context");
const organization_vendor_first_or_create_command_1 = require("./../organization-vendor-first-or-create.command");
const organization_vendor_service_1 = require("./../../organization-vendor.service");
let OrganizationVendorFirstOrCreateHandler = class OrganizationVendorFirstOrCreateHandler {
    constructor(_organizationVendorService) {
        this._organizationVendorService = _organizationVendorService;
    }
    async execute(command) {
        const { input } = command;
        try {
            const { organizationId, name } = input;
            const tenantId = context_1.RequestContext.currentTenantId();
            return await this._organizationVendorService.findOneByWhereOptions({
                tenantId,
                organizationId,
                name
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return await this._organizationVendorService.create(input);
            }
        }
    }
};
exports.OrganizationVendorFirstOrCreateHandler = OrganizationVendorFirstOrCreateHandler;
exports.OrganizationVendorFirstOrCreateHandler = OrganizationVendorFirstOrCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_vendor_first_or_create_command_1.OrganizationVendorFirstOrCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_vendor_service_1.OrganizationVendorService])
], OrganizationVendorFirstOrCreateHandler);
//# sourceMappingURL=organization-vendor-first-or-create.handler.js.map