"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubRepositoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const github_repository_service_1 = require("./github-repository.service");
const dto_1 = require("./dto");
// Mirrors every sibling GitHub controller. Without TenantPermissionGuard the global AuthGuard does
// not require a tenant in the request context, and a tenant-less request slips past the
// cross-tenant upsert guard in TenantAwareCrudService.create() (which cannot judge ownership with
// no tenant to compare against).
let GitHubRepositoryController = class GitHubRepositoryController {
    constructor(_githubRepositoryService) {
        this._githubRepositoryService = _githubRepositoryService;
    }
    /**
     * Sync a GitHub repository with Gauzy using provided data.
     *
     * @param entity The data needed for synchronization.
     * @returns The synchronized integration map.
     */
    async syncRepository(entity) {
        return await this._githubRepositoryService.syncGithubRepository(entity);
    }
    /**
     * Handle an HTTP PUT request to update a GitHub repository by its unique identifier.
     * @param id - A string representing the unique identifier of the GitHub repository.
     * @param input - An object representing the data to update the GitHub repository with.
     * @returns A Promise that resolves to the updated GitHub repository data.
     */
    async update(id, input) {
        // Ensure that a GitHub repository with the provided identifier exists IN THE CALLER'S TENANT.
        // `findOneByIdString` throws NotFoundException when it matches nothing, so this call is the
        // check; an unknown or foreign id never reaches `create()`.
        await this._githubRepositoryService.findOneByIdString(id);
        // Attempt to update the GitHub repository using the provided data.
        return await this._githubRepositoryService.create({
            ...input,
            id
        });
    }
};
exports.GitHubRepositoryController = GitHubRepositoryController;
tslib_1.__decorate([
    (0, common_1.Post)('/sync'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubRepositoryController.prototype, "syncRepository", null);
tslib_1.__decorate([
    (0, common_1.Put)('/:id'),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateGithubRepositoryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubRepositoryController.prototype, "update", null);
exports.GitHubRepositoryController = GitHubRepositoryController = tslib_1.__decorate([
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/github/repository'),
    tslib_1.__metadata("design:paramtypes", [github_repository_service_1.GithubRepositoryService])
], GitHubRepositoryController);
//# sourceMappingURL=github-repository.controller.js.map