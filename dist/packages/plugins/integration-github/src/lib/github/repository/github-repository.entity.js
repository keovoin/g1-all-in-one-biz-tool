"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationGithubRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const core_2 = require("@gauzy/core");
const github_repository_issue_entity_1 = require("./issue/github-repository-issue.entity");
const mikro_orm_organization_github_repository_repository_1 = require("./repository/mikro-orm-organization-github-repository.repository");
let OrganizationGithubRepository = class OrganizationGithubRepository extends core_1.TenantOrganizationBaseEntity {
};
exports.OrganizationGithubRepository = OrganizationGithubRepository;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ type: 'bigint', transformer: new core_2.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], OrganizationGithubRepository.prototype, "repositoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationGithubRepository.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationGithubRepository.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationGithubRepository.prototype, "owner", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationGithubRepository.prototype, "issuesCount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ nullable: true, default: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationGithubRepository.prototype, "hasSyncEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationGithubRepository.prototype, "private", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationGithubRepository.prototype, "status", void 0);
tslib_1.__decorate([
    (0, core_2.MultiORMManyToOne)(() => core_1.IntegrationTenant, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationGithubRepository.prototype, "integration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integration),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationGithubRepository.prototype, "integrationId", void 0);
tslib_1.__decorate([
    (0, core_2.MultiORMOneToMany)(() => github_repository_issue_entity_1.OrganizationGithubRepositoryIssue, (it) => it.repository, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], OrganizationGithubRepository.prototype, "issues", void 0);
exports.OrganizationGithubRepository = OrganizationGithubRepository = tslib_1.__decorate([
    (0, core_2.MultiORMEntity)('organization_github_repository', {
        mikroOrmRepository: () => mikro_orm_organization_github_repository_repository_1.MikroOrmOrganizationGithubRepositoryRepository
    })
], OrganizationGithubRepository);
//# sourceMappingURL=github-repository.entity.js.map