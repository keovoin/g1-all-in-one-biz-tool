"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmReportOrganizationRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_organization_entity_1 = require("../report-organization.entity");
let TypeOrmReportOrganizationRepository = class TypeOrmReportOrganizationRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmReportOrganizationRepository = TypeOrmReportOrganizationRepository;
exports.TypeOrmReportOrganizationRepository = TypeOrmReportOrganizationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(report_organization_entity_1.ReportOrganization)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmReportOrganizationRepository);
//# sourceMappingURL=type-orm-report-organization.repository.js.map