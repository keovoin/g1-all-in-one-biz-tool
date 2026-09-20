"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubRepositoryIssueService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const mikro_orm_github_repository_issue_repository_1 = require("./repository/mikro-orm-github-repository-issue.repository");
const type_orm_github_repository_issue_repository_1 = require("./repository/type-orm-github-repository-issue.repository");
let GithubRepositoryIssueService = class GithubRepositoryIssueService extends core_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationGithubRepositoryIssueRepository, mikroOrmOrganizationGithubRepositoryIssueRepository) {
        super(typeOrmOrganizationGithubRepositoryIssueRepository, mikroOrmOrganizationGithubRepositoryIssueRepository);
    }
};
exports.GithubRepositoryIssueService = GithubRepositoryIssueService;
exports.GithubRepositoryIssueService = GithubRepositoryIssueService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_github_repository_issue_repository_1.TypeOrmOrganizationGithubRepositoryIssueRepository,
        mikro_orm_github_repository_issue_repository_1.MikroOrmOrganizationGithubRepositoryIssueRepository])
], GithubRepositoryIssueService);
//# sourceMappingURL=github-repository-issue.service.js.map