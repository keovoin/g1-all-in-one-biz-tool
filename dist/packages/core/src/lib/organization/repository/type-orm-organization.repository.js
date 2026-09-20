"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("../organization.entity");
let TypeOrmOrganizationRepository = class TypeOrmOrganizationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationRepository = TypeOrmOrganizationRepository;
exports.TypeOrmOrganizationRepository = TypeOrmOrganizationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationRepository);
//# sourceMappingURL=type-orm-organization.repository.js.map