"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubHooksController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const common_2 = require("@gauzy/common");
const hook_decorator_1 = require("../probot/hook.decorator");
const github_hooks_service_1 = require("./github.hooks.service");
let GitHubHooksController = class GitHubHooksController {
    constructor(_githubHooksService) {
        this._githubHooksService = _githubHooksService;
    }
    /**
     * Handles the 'installation.deleted' event.
     *
     * @param context - The context object containing information about the event.
     */
    async installationDeleted(context) {
        if (!context.isBot) {
            await this._githubHooksService.installationDeleted(context);
        }
    }
    /**
     * Handles the 'issues.opened' event.
     *
     * @param context - The context object containing information about the event.
     */
    async issuesOpened(context) {
        if (!context.isBot) {
            await this._githubHooksService.issuesOpened(context);
        }
    }
    /**
     * Handles the 'issues.edited' event.
     *
     * @param context - The context object containing information about the event.
     */
    async issuesEdited(context) {
        if (!context.isBot) {
            await this._githubHooksService.issuesEdited(context);
        }
    }
    /**
     * Handles the 'issues.labeled' event.
     *
     * @param context - The context object containing information about the event.
     */
    async issuesLabeled(context) {
        if (!context.isBot) {
            await this._githubHooksService.issuesLabeled(context);
        }
    }
    /**
     * Handles the 'issues.labeled' event.
     *
     * @param context - The context object containing information about the event.
     */
    async issuesUnlabeled(context) {
        if (!context.isBot) {
            await this._githubHooksService.issuesUnlabeled(context);
        }
    }
};
exports.GitHubHooksController = GitHubHooksController;
tslib_1.__decorate([
    (0, hook_decorator_1.Hook)(['installation.deleted']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubHooksController.prototype, "installationDeleted", null);
tslib_1.__decorate([
    (0, hook_decorator_1.Hook)(['issues.opened']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubHooksController.prototype, "issuesOpened", null);
tslib_1.__decorate([
    (0, hook_decorator_1.Hook)(['issues.edited']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubHooksController.prototype, "issuesEdited", null);
tslib_1.__decorate([
    (0, hook_decorator_1.Hook)(['issues.labeled']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubHooksController.prototype, "issuesLabeled", null);
tslib_1.__decorate([
    (0, hook_decorator_1.Hook)(['issues.unlabeled']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", Promise)
], GitHubHooksController.prototype, "issuesUnlabeled", null);
exports.GitHubHooksController = GitHubHooksController = tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Controller)('/integration/github/webhook'),
    tslib_1.__metadata("design:paramtypes", [github_hooks_service_1.GithubHooksService])
], GitHubHooksController);
//# sourceMappingURL=github.hooks.controller.js.map