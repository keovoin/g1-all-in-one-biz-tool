"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeFindByProjectHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_strategic_initiative_find_by_project_query_1 = require("../organization-strategic-initiative.find-by-project.query");
const organization_strategic_initiative_service_1 = require("../../organization-strategic-initiative.service");
let OrganizationStrategicInitiativeFindByProjectHandler = class OrganizationStrategicInitiativeFindByProjectHandler {
    constructor(_organizationStrategicInitiativeService) {
        this._organizationStrategicInitiativeService = _organizationStrategicInitiativeService;
    }
    /**
     * Executes the find by project query for organization strategic initiatives.
     *
     * @param query - The query containing the project ID.
     * @returns A list of organization strategic initiatives linked to the project.
     */
    async execute(query) {
        const { projectId } = query;
        return await this._organizationStrategicInitiativeService.findByProject(projectId);
    }
};
exports.OrganizationStrategicInitiativeFindByProjectHandler = OrganizationStrategicInitiativeFindByProjectHandler;
exports.OrganizationStrategicInitiativeFindByProjectHandler = OrganizationStrategicInitiativeFindByProjectHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(organization_strategic_initiative_find_by_project_query_1.OrganizationStrategicInitiativeFindByProjectQuery),
    tslib_1.__metadata("design:paramtypes", [organization_strategic_initiative_service_1.OrganizationStrategicInitiativeService])
], OrganizationStrategicInitiativeFindByProjectHandler);
//# sourceMappingURL=organization-strategic-initiative.find-by-project.handler.js.map