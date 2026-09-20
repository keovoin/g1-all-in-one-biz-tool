"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmReportRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("../report.entity");
let TypeOrmReportRepository = class TypeOrmReportRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmReportRepository = TypeOrmReportRepository;
exports.TypeOrmReportRepository = TypeOrmReportRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmReportRepository);
//# sourceMappingURL=type-orm-report.repository.js.map