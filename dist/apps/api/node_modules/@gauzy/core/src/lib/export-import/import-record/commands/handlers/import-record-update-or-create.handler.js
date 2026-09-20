"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRecordUpdateOrCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const import_record_update_or_create_command_1 = require("../import-record-update-or-create.command");
const import_record_service_1 = require("../../import-record.service");
const context_1 = require("../../../../core/context");
let ImportRecordUpdateOrCreateHandler = class ImportRecordUpdateOrCreateHandler {
    constructor(_importRecordService) {
        this._importRecordService = _importRecordService;
    }
    async execute(event) {
        const { options, input = {} } = event;
        const payload = Object.assign({}, options, input);
        const { sourceId, destinationId, entityType, tenantId = context_1.RequestContext.currentTenantId() } = payload;
        try {
            const record = await this._importRecordService.findOneByWhereOptions(options);
            if (record) {
                return {
                    ...await this._importRecordService.create({
                        id: record.id,
                        tenantId,
                        sourceId,
                        destinationId,
                        entityType
                    }),
                    wasCreated: false
                };
            }
        }
        catch (error) {
            return {
                ...await this._importRecordService.create({
                    tenantId,
                    sourceId,
                    destinationId,
                    entityType
                }),
                wasCreated: true
            };
        }
    }
};
exports.ImportRecordUpdateOrCreateHandler = ImportRecordUpdateOrCreateHandler;
exports.ImportRecordUpdateOrCreateHandler = ImportRecordUpdateOrCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(import_record_update_or_create_command_1.ImportRecordUpdateOrCreateCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => import_record_service_1.ImportRecordService))),
    tslib_1.__metadata("design:paramtypes", [import_record_service_1.ImportRecordService])
], ImportRecordUpdateOrCreateHandler);
//# sourceMappingURL=import-record-update-or-create.handler.js.map