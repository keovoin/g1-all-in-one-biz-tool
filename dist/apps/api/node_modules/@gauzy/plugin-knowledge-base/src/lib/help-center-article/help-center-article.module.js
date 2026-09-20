"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const help_center_article_entity_1 = require("./help-center-article.entity");
const help_center_article_version_entity_1 = require("./help-center-article-version.entity");
const help_center_article_service_1 = require("./help-center-article.service");
const help_center_article_version_service_1 = require("./help-center-article-version.service");
const help_center_article_controller_1 = require("./help-center-article.controller");
const help_center_article_version_controller_1 = require("./help-center-article-version.controller");
const handlers_1 = require("./commands/handlers");
const type_orm_help_center_article_repository_1 = require("./repository/type-orm-help-center-article.repository");
const type_orm_help_center_article_version_repository_1 = require("./repository/type-orm-help-center-article-version.repository");
let HelpCenterArticleModule = class HelpCenterArticleModule {
};
exports.HelpCenterArticleModule = HelpCenterArticleModule;
exports.HelpCenterArticleModule = HelpCenterArticleModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([help_center_article_entity_1.HelpCenterArticle, help_center_article_version_entity_1.HelpCenterArticleVersion]),
            nestjs_1.MikroOrmModule.forFeature([help_center_article_entity_1.HelpCenterArticle, help_center_article_version_entity_1.HelpCenterArticleVersion]),
            core_1.RolePermissionModule
        ],
        controllers: [help_center_article_controller_1.HelpCenterArticleController, help_center_article_version_controller_1.HelpCenterArticleVersionController],
        providers: [
            help_center_article_service_1.HelpCenterArticleService,
            help_center_article_version_service_1.HelpCenterArticleVersionService,
            type_orm_help_center_article_repository_1.TypeOrmHelpCenterArticleRepository,
            type_orm_help_center_article_version_repository_1.TypeOrmHelpCenterArticleVersionRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [
            help_center_article_service_1.HelpCenterArticleService,
            help_center_article_version_service_1.HelpCenterArticleVersionService,
            type_orm_help_center_article_repository_1.TypeOrmHelpCenterArticleRepository,
            type_orm_help_center_article_version_repository_1.TypeOrmHelpCenterArticleVersionRepository
        ]
    })
], HelpCenterArticleModule);
//# sourceMappingURL=help-center-article.module.js.map