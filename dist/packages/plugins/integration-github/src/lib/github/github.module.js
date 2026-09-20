"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubModule = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const config_1 = require("@gauzy/config");
const probot_module_1 = require("../probot/probot.module");
const handlers_1 = require("./commands/handlers");
const github_event_subscriber_1 = require("./github-event.subscriber");
const github_authorization_controller_1 = require("./github-authorization.controller");
const github_integration_controller_1 = require("./github-integration.controller");
const github_controller_1 = require("./github.controller");
const github_service_1 = require("./github.service");
const github_oauth_state_service_1 = require("./github-oauth-state.service");
const github_middleware_1 = require("./github.middleware");
const github_hooks_controller_1 = require("./github.hooks.controller");
const github_hooks_service_1 = require("./github.hooks.service");
const github_sync_controller_1 = require("./github-sync.controller");
const github_sync_service_1 = require("./github-sync.service");
const github_repository_controller_1 = require("./repository/github-repository.controller");
const github_repository_service_1 = require("./repository/github-repository.service");
const github_repository_entity_1 = require("./repository/github-repository.entity");
const github_repository_issue_entity_1 = require("./repository/issue/github-repository-issue.entity");
const github_repository_issue_service_1 = require("./repository/issue/github-repository-issue.service");
const type_orm_organization_github_repository_repository_1 = require("./repository/repository/type-orm-organization-github-repository.repository");
const type_orm_github_repository_issue_repository_1 = require("./repository/issue/repository/type-orm-github-repository-issue.repository");
const mikro_orm_organization_github_repository_repository_1 = require("./repository/repository/mikro-orm-organization-github-repository.repository");
const mikro_orm_github_repository_issue_repository_1 = require("./repository/issue/repository/mikro-orm-github-repository-issue.repository");
// Import the Probot configuration module
const { github } = config_1.environment;
let GithubModule = class GithubModule {
    /**
     * Configures middleware for specific routes.
     *
     * @param consumer - The middleware consumer to apply the middlewares.
     */
    configure(consumer) {
        // Apply the GithubMiddleware to specific routes
        consumer.apply(github_middleware_1.GithubMiddleware).forRoutes(
        // Define routes and HTTP methods for which the middleware should be applied
        {
            path: '/integration/github/:integrationId/metadata',
            method: common_1.RequestMethod.GET
        }, {
            path: '/integration/github/:integrationId/repositories',
            method: common_1.RequestMethod.GET
        }, {
            path: '/integration/github/:integrationId/:owner/:repo/issues',
            method: common_1.RequestMethod.GET
        }, {
            path: '/integration/github/:integrationId/manual-sync/issues',
            method: common_1.RequestMethod.POST
        }, {
            path: '/integration/github/:integrationId/auto-sync/issues',
            method: common_1.RequestMethod.POST
        }); // Apply the middleware to specific routes and methods
    }
};
exports.GithubModule = GithubModule;
exports.GithubModule = GithubModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([
                github_repository_entity_1.OrganizationGithubRepository,
                github_repository_issue_entity_1.OrganizationGithubRepositoryIssue
            ]),
            nestjs_1.MikroOrmModule.forFeature([
                github_repository_entity_1.OrganizationGithubRepository,
                github_repository_issue_entity_1.OrganizationGithubRepositoryIssue
            ]),
            // Probot Configuration
            probot_module_1.ProbotModule.forRoot({
                isGlobal: true,
                // Webhook URL in GitHub will be: https://api.gauzy.co/api/integration/github/webhook
                path: 'integration/github/webhook',
                config: {
                    /** Client Configuration */
                    clientId: github.clientId,
                    clientSecret: github.clientSecret,
                    appId: github.appId,
                    privateKey: github.appPrivateKey,
                    webhookSecret: github.webhookSecret
                }
            }),
            core_1.PluginCommonModule,
            core_1.RolePermissionModule,
            cqrs_1.CqrsModule,
            (0, common_1.forwardRef)(() => core_1.OrganizationProjectModule),
            (0, common_1.forwardRef)(() => core_1.IntegrationModule),
            (0, common_1.forwardRef)(() => core_1.IntegrationTenantModule),
            (0, common_1.forwardRef)(() => core_1.IntegrationSettingModule),
            (0, common_1.forwardRef)(() => core_1.IntegrationMapModule),
        ],
        controllers: [
            github_authorization_controller_1.GitHubAuthorizationController,
            github_controller_1.GitHubController,
            github_hooks_controller_1.GitHubHooksController,
            github_integration_controller_1.GitHubIntegrationController,
            github_sync_controller_1.GitHubSyncController,
            github_repository_controller_1.GitHubRepositoryController
        ],
        providers: [
            // Define middleware heres
            github_middleware_1.GithubMiddleware,
            // Define services heres
            github_event_subscriber_1.GithubEventSubscriber,
            github_service_1.GithubService,
            github_oauth_state_service_1.GithubOAuthStateService,
            github_sync_service_1.GithubSyncService,
            github_hooks_service_1.GithubHooksService,
            github_repository_service_1.GithubRepositoryService,
            github_repository_issue_service_1.GithubRepositoryIssueService,
            // Define repositories heres
            type_orm_organization_github_repository_repository_1.TypeOrmOrganizationGithubRepositoryRepository,
            mikro_orm_organization_github_repository_repository_1.MikroOrmOrganizationGithubRepositoryRepository,
            type_orm_github_repository_issue_repository_1.TypeOrmOrganizationGithubRepositoryIssueRepository,
            mikro_orm_github_repository_issue_repository_1.MikroOrmOrganizationGithubRepositoryIssueRepository,
            // Define handlers heres
            ...handlers_1.CommandHandlers
        ],
        exports: [type_orm_organization_github_repository_repository_1.TypeOrmOrganizationGithubRepositoryRepository, type_orm_github_repository_issue_repository_1.TypeOrmOrganizationGithubRepositoryIssueRepository]
    })
], GithubModule);
//# sourceMappingURL=github.module.js.map