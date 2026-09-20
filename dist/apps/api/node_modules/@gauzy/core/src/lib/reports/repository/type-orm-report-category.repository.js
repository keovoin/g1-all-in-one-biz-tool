"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmReportCategoryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_category_entity_1 = require("../report-category.entity");
let TypeOrmReportCategoryRepository = class TypeOrmReportCategoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmReportCategoryRepository = TypeOrmReportCategoryRepository;
exports.TypeOrmReportCategoryRepository = TypeOrmReportCategoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(report_category_entity_1.ReportCategory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmReportCategoryRepository);
//# sourceMappingURL=type-orm-report-category.repository.js.map