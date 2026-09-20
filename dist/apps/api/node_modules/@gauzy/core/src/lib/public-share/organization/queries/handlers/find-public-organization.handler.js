"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPublicOrganizationHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const find_public_organization_query_1 = require("./../find-public-organization.query");
const public_organization_service_1 = require("./../../public-organization.service");
let FindPublicOrganizationHandler = class FindPublicOrganizationHandler {
    constructor(publicOrganizationService) {
        this.publicOrganizationService = publicOrganizationService;
    }
    async execute(query) {
        const { params, relations = [] } = query;
        return await this.publicOrganizationService.findOneByProfileLink(params, relations);
    }
};
exports.FindPublicOrganizationHandler = FindPublicOrganizationHandler;
exports.FindPublicOrganizationHandler = FindPublicOrganizationHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_public_organization_query_1.FindPublicOrganizationQuery),
    tslib_1.__metadata("design:paramtypes", [public_organization_service_1.PublicOrganizationService])
], FindPublicOrganizationHandler);
//# sourceMappingURL=find-public-organization.handler.js.map