"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRequestApprovalTeamRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const request_approval_team_entity_1 = require("../request-approval-team.entity");
let TypeOrmRequestApprovalTeamRepository = class TypeOrmRequestApprovalTeamRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmRequestApprovalTeamRepository = TypeOrmRequestApprovalTeamRepository;
exports.TypeOrmRequestApprovalTeamRepository = TypeOrmRequestApprovalTeamRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(request_approval_team_entity_1.RequestApprovalTeam)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmRequestApprovalTeamRepository);
//# sourceMappingURL=type-orm-request-approval-team.repository.js.map