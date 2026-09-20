"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterAuthor = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const entities_1 = require("./../entities");
const mikro_orm_help_center_author_repository_1 = require("./repository/mikro-orm-help-center-author.repository");
let HelpCenterAuthor = class HelpCenterAuthor extends core_1.TenantOrganizationBaseEntity {
};
exports.HelpCenterAuthor = HelpCenterAuthor;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => core_1.Employee }),
    (0, core_1.MultiORMManyToOne)(() => core_1.Employee, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterAuthor.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterAuthor.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => entities_1.HelpCenterArticle }),
    (0, core_1.MultiORMManyToOne)(() => entities_1.HelpCenterArticle, (article) => article.authors, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], HelpCenterAuthor.prototype, "article", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.article),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], HelpCenterAuthor.prototype, "articleId", void 0);
exports.HelpCenterAuthor = HelpCenterAuthor = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('knowledge_base_author', { mikroOrmRepository: () => mikro_orm_help_center_author_repository_1.MikroOrmHelpCenterAuthorRepository })
], HelpCenterAuthor);
//# sourceMappingURL=help-center-author.entity.js.map