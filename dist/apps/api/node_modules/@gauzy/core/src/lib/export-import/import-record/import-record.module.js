"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRecordModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const import_record_entity_1 = require("./import-record.entity");
const import_record_service_1 = require("./import-record.service");
const type_orm_import_record_repository_1 = require("./repository/type-orm-import-record.repository");
const mikro_orm_import_record_repository_1 = require("./repository/mikro-orm-import-record.repository");
let ImportRecordModule = class ImportRecordModule {
};
exports.ImportRecordModule = ImportRecordModule;
exports.ImportRecordModule = ImportRecordModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, typeorm_1.TypeOrmModule.forFeature([import_record_entity_1.ImportRecord]), nestjs_1.MikroOrmModule.forFeature([import_record_entity_1.ImportRecord])],
        providers: [import_record_service_1.ImportRecordService, type_orm_import_record_repository_1.TypeOrmImportRecordRepository, mikro_orm_import_record_repository_1.MikroOrmImportRecordRepository, ...handlers_1.CommandHandlers],
        exports: [import_record_service_1.ImportRecordService]
    })
], ImportRecordModule);
//# sourceMappingURL=import-record.module.js.map