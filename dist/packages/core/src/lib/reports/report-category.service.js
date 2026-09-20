"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("../core/crud");
const type_orm_report_category_repository_1 = require("./repository/type-orm-report-category.repository");
const mikro_orm_report_category_repository_1 = require("./repository/mikro-orm-report-category.repository");
let ReportCategoryService = class ReportCategoryService extends crud_1.CrudService {
    constructor(typeOrmReportCategoryRepository, mikroOrmReportCategoryRepository) {
        super(typeOrmReportCategoryRepository, mikroOrmReportCategoryRepository);
    }
};
exports.ReportCategoryService = ReportCategoryService;
exports.ReportCategoryService = ReportCategoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_report_category_repository_1.TypeOrmReportCategoryRepository,
        mikro_orm_report_category_repository_1.MikroOrmReportCategoryRepository])
], ReportCategoryService);
//# sourceMappingURL=report-category.service.js.map