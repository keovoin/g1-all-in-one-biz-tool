"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategory = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_report_category_repository_1 = require("./repository/mikro-orm-report-category.repository");
let ReportCategory = class ReportCategory extends internal_1.BaseEntity {
};
exports.ReportCategory = ReportCategory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ReportCategory.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], ReportCategory.prototype, "iconClass", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Report, (it) => it.category, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], ReportCategory.prototype, "reports", void 0);
exports.ReportCategory = ReportCategory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('report_category', { mikroOrmRepository: () => mikro_orm_report_category_repository_1.MikroOrmReportCategoryRepository })
], ReportCategory);
//# sourceMappingURL=report-category.entity.js.map