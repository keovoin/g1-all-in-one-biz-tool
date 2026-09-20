"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportHistoryCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const import_history_service_1 = require("./../../import-history.service");
const import_history_create_command_1 = require("../import-history-create.command");
let ImportHistoryCreateHandler = class ImportHistoryCreateHandler {
    constructor(_importHistoryService) {
        this._importHistoryService = _importHistoryService;
    }
    async execute(event) {
        try {
            const { input } = event;
            return await this._importHistoryService.create(input);
        }
        catch (error) {
            console.log('Error while creating import history', error);
        }
    }
};
exports.ImportHistoryCreateHandler = ImportHistoryCreateHandler;
exports.ImportHistoryCreateHandler = ImportHistoryCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(import_history_create_command_1.ImportHistoryCreateCommand),
    tslib_1.__param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => import_history_service_1.ImportHistoryService))),
    tslib_1.__metadata("design:paramtypes", [import_history_service_1.ImportHistoryService])
], ImportHistoryCreateHandler);
//# sourceMappingURL=import-history-create.handler.js.map