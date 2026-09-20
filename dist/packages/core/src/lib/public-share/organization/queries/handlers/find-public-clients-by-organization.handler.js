"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPublicClientsByOrganizationHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const find_public_clients_by_organization_query_1 = require("./../find-public-clients-by-organization.query");
const public_organization_service_1 = require("./../../public-organization.service");
let FindPublicClientsByOrganizationHandler = class FindPublicClientsByOrganizationHandler {
    constructor(publicOrganizationService) {
        this.publicOrganizationService = publicOrganizationService;
    }
    async execute(query) {
        const { options } = query;
        return await this.publicOrganizationService.findPublicClientsByOrganization(options);
    }
};
exports.FindPublicClientsByOrganizationHandler = FindPublicClientsByOrganizationHandler;
exports.FindPublicClientsByOrganizationHandler = FindPublicClientsByOrganizationHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_public_clients_by_organization_query_1.FindPublicClientsByOrganizationQuery),
    tslib_1.__metadata("design:paramtypes", [public_organization_service_1.PublicOrganizationService])
], FindPublicClientsByOrganizationHandler);
//# sourceMappingURL=find-public-clients-by-organization.handler.js.map