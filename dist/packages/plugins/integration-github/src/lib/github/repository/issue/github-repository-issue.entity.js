"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationGithubRepositoryIssue = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const core_2 = require("@gauzy/core");
const github_repository_entity_1 = require("./../github-repository.entity");
const mikro_orm_github_repository_issue_repository_1 = require("./repository/mikro-orm-github-repository-issue.repository");
let OrganizationGithubRepositoryIssue = class OrganizationGithubRepositoryIssue extends core_1.TenantOrganizationBaseEntity {
};
exports.OrganizationGithubRepositoryIssue = OrganizationGithubRepositoryIssue;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ type: 'bigint' }),
    tslib_1.__metadata("design:type", Number)
], OrganizationGithubRepositoryIssue.prototype, "issueId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrganizationGithubRepositoryIssue.prototype, "issueNumber", void 0);
tslib_1.__decorate([
    (0, core_2.MultiORMManyToOne)(() => github_repository_entity_1.OrganizationGithubRepository, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationGithubRepositoryIssue.prototype, "repository", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.repository),
    (0, core_2.ColumnIndex)(),
    (0, core_2.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationGithubRepositoryIssue.prototype, "repositoryId", void 0);
exports.OrganizationGithubRepositoryIssue = OrganizationGithubRepositoryIssue = tslib_1.__decorate([
    (0, core_2.MultiORMEntity)('organization_github_repository_issue', {
        mikroOrmRepository: () => mikro_orm_github_repository_issue_repository_1.MikroOrmOrganizationGithubRepositoryIssueRepository
    })
], OrganizationGithubRepositoryIssue);
//# sourceMappingURL=github-repository-issue.entity.js.map