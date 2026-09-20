"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeFindAllHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_strategic_initiative_find_all_query_1 = require("../organization-strategic-initiative.find-all.query");
const organization_strategic_initiative_service_1 = require("../../organization-strategic-initiative.service");
let OrganizationStrategicInitiativeFindAllHandler = class OrganizationStrategicInitiativeFindAllHandler {
    constructor(_organizationStrategicInitiativeService) {
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
    }
    /**
     * Executes the find all query for organization strategic initiatives.
     *
     * @param query - The query containing filter options.
     * @returns A paginated list of organization strategic initiatives.
     */
    async execute(query) {
        const { options } = query;
        return await this._organizationStrategicInitiativeService.findAll(options);
    }
};
exports.OrganizationStrategicInitiativeFindAllHandler = OrganizationStrategicInitiativeFindAllHandler;
exports.OrganizationStrategicInitiativeFindAllHandler = OrganizationStrategicInitiativeFindAllHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(organization_strategic_initiative_find_all_query_1.OrganizationStrategicInitiativeFindAllQuery),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService])
], OrganizationStrategicInitiativeFindAllHandler);
//# sourceMappingURL=organization-strategic-initiative.find-all.handler.js.map