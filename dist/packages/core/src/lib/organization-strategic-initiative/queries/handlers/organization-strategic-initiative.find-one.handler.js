"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeFindOneHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_strategic_initiative_find_one_query_1 = require("../organization-strategic-initiative.find-one.query");
const organization_strategic_initiative_service_1 = require("../../organization-strategic-initiative.service");
let OrganizationStrategicInitiativeFindOneHandler = class OrganizationStrategicInitiativeFindOneHandler {
    constructor(_organizationStrategicInitiativeService) {
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
    }
    /**
     * Executes the find one query for an organization strategic initiative.
     *
     * @param query - The query containing the ID and options.
     * @returns The found organization strategic initiative.
     */
    async execute(query) {
        const { id, options } = query;
        return await this._organizationStrategicInitiativeService.findOneById(id, options);
    }
};
exports.OrganizationStrategicInitiativeFindOneHandler = OrganizationStrategicInitiativeFindOneHandler;
exports.OrganizationStrategicInitiativeFindOneHandler = OrganizationStrategicInitiativeFindOneHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(organization_strategic_initiative_find_one_query_1.OrganizationStrategicInitiativeFindOneQuery),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService])
], OrganizationStrategicInitiativeFindOneHandler);
//# sourceMappingURL=organization-strategic-initiative.find-one.handler.js.map