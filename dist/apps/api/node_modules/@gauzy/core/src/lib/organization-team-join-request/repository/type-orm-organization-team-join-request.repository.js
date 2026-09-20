"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationTeamJoinRequestRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_team_join_request_entity_1 = require("../organization-team-join-request.entity");
let TypeOrmOrganizationTeamJoinRequestRepository = class TypeOrmOrganizationTeamJoinRequestRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationTeamJoinRequestRepository = TypeOrmOrganizationTeamJoinRequestRepository;
exports.TypeOrmOrganizationTeamJoinRequestRepository = TypeOrmOrganizationTeamJoinRequestRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_team_join_request_entity_1.OrganizationTeamJoinRequest)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationTeamJoinRequestRepository);
//# sourceMappingURL=type-orm-organization-team-join-request.repository.js.map