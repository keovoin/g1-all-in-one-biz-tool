"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationAwardRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_award_entity_1 = require("../organization-award.entity");
let TypeOrmOrganizationAwardRepository = class TypeOrmOrganizationAwardRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationAwardRepository = TypeOrmOrganizationAwardRepository;
exports.TypeOrmOrganizationAwardRepository = TypeOrmOrganizationAwardRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_award_entity_1.OrganizationAward)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationAwardRepository);
//# sourceMappingURL=type-orm-organization-award.repository.js.map