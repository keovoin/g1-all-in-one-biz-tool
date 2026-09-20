"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationStrategicInitiativeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_strategic_initiative_entity_1 = require("../organization-strategic-initiative.entity");
let TypeOrmOrganizationStrategicInitiativeRepository = class TypeOrmOrganizationStrategicInitiativeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationStrategicInitiativeRepository = TypeOrmOrganizationStrategicInitiativeRepository;
exports.TypeOrmOrganizationStrategicInitiativeRepository = TypeOrmOrganizationStrategicInitiativeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_strategic_initiative_entity_1.OrganizationStrategicInitiative)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationStrategicInitiativeRepository);
//# sourceMappingURL=type-orm-organization-strategic-initiative.repository.js.map