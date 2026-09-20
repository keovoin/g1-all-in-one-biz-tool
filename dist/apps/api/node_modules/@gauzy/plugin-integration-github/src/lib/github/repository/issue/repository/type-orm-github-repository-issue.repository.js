"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationGithubRepositoryIssueRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const github_repository_issue_entity_1 = require("../github-repository-issue.entity");
let TypeOrmOrganizationGithubRepositoryIssueRepository = class TypeOrmOrganizationGithubRepositoryIssueRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationGithubRepositoryIssueRepository = TypeOrmOrganizationGithubRepositoryIssueRepository;
exports.TypeOrmOrganizationGithubRepositoryIssueRepository = TypeOrmOrganizationGithubRepositoryIssueRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(github_repository_issue_entity_1.OrganizationGithubRepositoryIssue)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationGithubRepositoryIssueRepository);
//# sourceMappingURL=type-orm-github-repository-issue.repository.js.map