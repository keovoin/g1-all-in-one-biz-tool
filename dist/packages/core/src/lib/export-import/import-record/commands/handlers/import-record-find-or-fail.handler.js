"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRecordFindOrFailHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const import_record_service_1 = require("./../../import-record.service");
const import_record_find_or_fail_command_1 = require("./../import-record-find-or-fail.command");
let ImportRecordFindOrFailHandler = class ImportRecordFindOrFailHandler {
    constructor(_importRecordService) {
        this._importRecordService = _importRecordService;
    }
    async execute(event) {
        try {
            const { input } = event;
            return await this._importRecordService.findOneOrFailByWhereOptions(input);
        }
        catch (error) {
            throw new common_1.NotFoundException(`The import record was not found`);
        }
    }
};
exports.ImportRecordFindOrFailHandler = ImportRecordFindOrFailHandler;
exports.ImportRecordFindOrFailHandler = ImportRecordFindOrFailHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(import_record_find_or_fail_command_1.ImportRecordFindOrFailCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => import_record_service_1.ImportRecordService))),
    tslib_1.__metadata("design:paramtypes", [import_record_service_1.ImportRecordService])
], ImportRecordFindOrFailHandler);
//# sourceMappingURL=import-record-find-or-fail.handler.js.map