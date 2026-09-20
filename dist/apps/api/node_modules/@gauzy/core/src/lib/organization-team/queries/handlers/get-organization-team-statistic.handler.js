"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationTeamStatisticHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const get_organization_team_statistic_query_1 = require("../get-organization-team-statistic.query");
const organization_team_service_1 = require("../../organization-team.service");
let GetOrganizationTeamStatisticHandler = class GetOrganizationTeamStatisticHandler {
    constructor(_organizationTeamService) {
        this._organizationTeamService = _organizationTeamService;
    }
    /**
    * Executes the given query to get organization team statistics.
    *
    * @param input - The query input containing parameters to fetch the team statistics.
    * @returns A promise resolving to an object representing the organization team statistics.
    * @throws SomeException - If an error occurs during execution.
    */
    async execute(input) {
        try {
            return await this._organizationTeamService.getOrganizationTeamStatistic(input);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to execute organization team statistic query`);
        }
    }
};
exports.GetOrganizationTeamStatisticHandler = GetOrganizationTeamStatisticHandler;
exports.GetOrganizationTeamStatisticHandler = GetOrganizationTeamStatisticHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_organization_team_statistic_query_1.GetOrganizationTeamStatisticQuery),
    tslib_1.__metadata("design:paramtypes", [organization_team_service_1.OrganizationTeamService])
], GetOrganizationTeamStatisticHandler);
//# sourceMappingURL=get-organization-team-statistic.handler.js.map