"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamJoinRequestCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const organization_team_join_request_service_1 = require("../../organization-team-join-request.service");
const organization_team_join_request_create_command_1 = require("../organization-team-join-request.create.command");
let OrganizationTeamJoinRequestCreateHandler = class OrganizationTeamJoinRequestCreateHandler {
    constructor(_organizationTeamJoinRequestService) {
        this._organizationTeamJoinRequestService = _organizationTeamJoinRequestService;
    }
    async execute(command) {
        try {
            const { input, languageCode } = command;
            await this._organizationTeamJoinRequestService.create(input, languageCode);
        }
        finally {
            return new Object({ status: common_1.HttpStatus.OK, message: `OK` });
        }
    }
};
exports.OrganizationTeamJoinRequestCreateHandler = OrganizationTeamJoinRequestCreateHandler;
exports.OrganizationTeamJoinRequestCreateHandler = OrganizationTeamJoinRequestCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_team_join_request_create_command_1.OrganizationTeamJoinRequestCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_team_join_request_service_1.OrganizationTeamJoinRequestService])
], OrganizationTeamJoinRequestCreateHandler);
//# sourceMappingURL=organization-team-join-request.create.handler.js.map