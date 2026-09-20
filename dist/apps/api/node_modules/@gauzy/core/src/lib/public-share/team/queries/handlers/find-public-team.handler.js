"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPublicTeamHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const find_public_team_query_1 = require("../find-public-team.query");
const public_team_service_1 = require("./../../public-team.service");
let FindPublicTeamHandler = class FindPublicTeamHandler {
    constructor(_publicTeamService) {
        this._publicTeamService = _publicTeamService;
    }
    /**
     * Executes a query to find a public team by a given profile link.
     * @param query - An object containing the parameters and optional query options.
     * @returns A promise that resolves to an `IOrganizationTeam`.
     */
    async execute(query) {
        const { params, options } = query; // Extract parameters and options from the query
        return await this._publicTeamService.findOneByProfileLink(params, options); // Find the team by the profile link
    }
};
exports.FindPublicTeamHandler = FindPublicTeamHandler;
exports.FindPublicTeamHandler = FindPublicTeamHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_public_team_query_1.FindPublicTeamQuery),
    tslib_1.__metadata("design:paramtypes", [public_team_service_1.PublicTeamService])
], FindPublicTeamHandler);
//# sourceMappingURL=find-public-team.handler.js.map