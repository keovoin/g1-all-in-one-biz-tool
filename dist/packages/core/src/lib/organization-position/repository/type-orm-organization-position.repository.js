"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationPositionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_position_entity_1 = require("../organization-position.entity");
let TypeOrmOrganizationPositionRepository = class TypeOrmOrganizationPositionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationPositionRepository = TypeOrmOrganizationPositionRepository;
exports.TypeOrmOrganizationPositionRepository = TypeOrmOrganizationPositionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_position_entity_1.OrganizationPosition)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationPositionRepository);
//# sourceMappingURL=type-orm-organization-position.repository.js.map