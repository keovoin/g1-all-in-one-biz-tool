"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticle = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const entities_1 = require("./../entities");
const mikro_orm_help_center_article_repository_1 = require("./repository/mikro-orm-help-center-article.repository");
let HelpCenterArticle = class HelpCenterArticle extends core_1.TenantOrganizationBaseEntity {
};
exports.HelpCenterArticle = HelpCenterArticle;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], HelpCenterArticle.prototype, "draft", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], HelpCenterArticle.prototype, "privacy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], HelpCenterArticle.prototype, "index", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "descriptionHtml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticle.prototype, "descriptionJson", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'bytea' : (0, config_1.isMySQL)() ? 'longblob' : 'blob', nullable: true }),
    tslib_1.__metadata("design:type", Uint8Array)
], HelpCenterArticle.prototype, "descriptionBinary", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], HelpCenterArticle.prototype, "isLocked", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "externalId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => entities_1.HelpCenter, (center) => center.articles, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticle.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.category),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => HelpCenterArticle, (article) => article.children, {
        nullable: true,
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticle.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.parent),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterArticle.prototype, "ownedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.ownedBy),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterArticle.prototype, "ownedById", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => HelpCenterArticle, (article) => article.parent),
    tslib_1.__metadata("design:type", Array)
], HelpCenterArticle.prototype, "children", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => entities_1.HelpCenterAuthor, (author) => author.article, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], HelpCenterArticle.prototype, "authors", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMOneToMany)(() => entities_1.HelpCenterArticleVersion, (version) => version.article, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], HelpCenterArticle.prototype, "versions", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToMany)(() => core_1.OrganizationProject, {
        /**  Database cascade action on update. */
        onUpdate: 'CASCADE',
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'knowledge_base_article_project',
        /** Column in pivot table referencing 'help_center_article' primary key. */
        joinColumn: 'knowledgeBaseArticleId',
        /** Column in pivot table referencing 'project' primary key. */
        inverseJoinColumn: 'organizationProjectId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'knowledge_base_article_project' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], HelpCenterArticle.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToMany)(() => core_1.Tag, {
        /**  Database cascade action on update. */
        onUpdate: 'CASCADE',
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true,
        /** Pivot table for many-to-many relationship. */
        pivotTable: 'tag_help_center_article',
        /** Column in pivot table referencing 'help_center_article' primary key. */
        joinColumn: 'knowledgeBaseArticleId',
        /** Column in pivot table referencing 'tag' primary key. */
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_help_center_article' }),
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], HelpCenterArticle.prototype, "tags", void 0);
exports.HelpCenterArticle = HelpCenterArticle = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('knowledge_base_article', { mikroOrmRepository: () => mikro_orm_help_center_article_repository_1.MikroOrmHelpCenterArticleRepository })
], HelpCenterArticle);
//# sourceMappingURL=help-center-article.entity.js.map