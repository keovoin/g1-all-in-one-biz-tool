"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRecordService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../../core/crud");
const mikro_orm_import_record_repository_1 = require("./repository/mikro-orm-import-record.repository");
const type_orm_import_record_repository_1 = require("./repository/type-orm-import-record.repository");
let ImportRecordService = class ImportRecordService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmImportRecordRepository, mikroOrmImportRecordRepository) {
        super(typeOrmImportRecordRepository, mikroOrmImportRecordRepository);
        this.typeOrmImportRecordRepository = typeOrmImportRecordRepository;
        this.mikroOrmImportRecordRepository = mikroOrmImportRecordRepository;
    }
};
exports.ImportRecordService = ImportRecordService;
exports.ImportRecordService = ImportRecordService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_import_record_repository_1.TypeOrmImportRecordRepository,
        mikro_orm_import_record_repository_1.MikroOrmImportRecordRepository])
], ImportRecordService);
//# sourceMappingURL=import-record.service.js.map