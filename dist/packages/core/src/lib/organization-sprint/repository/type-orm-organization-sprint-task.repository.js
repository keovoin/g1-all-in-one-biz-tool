"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationSprintTaskRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_sprint_task_entity_1 = require("../organization-sprint-task.entity");
let TypeOrmOrganizationSprintTaskRepository = class TypeOrmOrganizationSprintTaskRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationSprintTaskRepository = TypeOrmOrganizationSprintTaskRepository;
exports.TypeOrmOrganizationSprintTaskRepository = TypeOrmOrganizationSprintTaskRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_sprint_task_entity_1.OrganizationSprintTask)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationSprintTaskRepository);
//# sourceMappingURL=type-orm-organization-sprint-task.repository.js.map