"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleVersion = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const help_center_article_entity_1 = require("./help-center-article.entity");
const mikro_orm_help_center_article_version_repository_1 = require("./repository/mikro-orm-help-center-article-version.repository");
let HelpCenterArticleVersion = class HelpCenterArticleVersion extends core_1.TenantOrganizationBaseEntity {
};
exports.HelpCenterArticleVersion = HelpCenterArticleVersion;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticleVersion.prototype, "descriptionHtml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticleVersion.prototype, "descriptionJson", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'bytea' : (0, config_1.isMySQL)() ? 'longblob' : 'blob', nullable: true }),
    tslib_1.__metadata("design:type", Uint8Array)
], HelpCenterArticleVersion.prototype, "descriptionBinary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], HelpCenterArticleVersion.prototype, "lastSavedAt", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => help_center_article_entity_1.HelpCenterArticle, (article) => article.versions, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticleVersion.prototype, "article", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.article),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticleVersion.prototype, "articleId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticleVersion.prototype, "ownedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.ownedBy),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticleVersion.prototype, "ownedById", void 0);
exports.HelpCenterArticleVersion = HelpCenterArticleVersion = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('knowledge_base_article_version', { mikroOrmRepository: () => mikro_orm_help_center_article_version_repository_1.MikroOrmHelpCenterArticleVersionRepository })
], HelpCenterArticleVersion);
//# sourceMappingURL=help-center-article-version.entity.js.map