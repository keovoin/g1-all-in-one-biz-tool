"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmUserOrganizationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_organization_entity_1 = require("../user-organization.entity");
let TypeOrmUserOrganizationRepository = class TypeOrmUserOrganizationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmUserOrganizationRepository = TypeOrmUserOrganizationRepository;
exports.TypeOrmUserOrganizationRepository = TypeOrmUserOrganizationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_organization_entity_1.UserOrganization)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmUserOrganizationRepository);
//# sourceMappingURL=type-orm-user-organization.repository.js.map