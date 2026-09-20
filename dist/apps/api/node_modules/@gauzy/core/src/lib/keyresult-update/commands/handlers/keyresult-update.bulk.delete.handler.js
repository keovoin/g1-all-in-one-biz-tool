"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyResultUpdateBulKDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const __1 = require("..");
const keyresult_update_service_1 = require("../../keyresult-update.service");
let KeyResultUpdateBulKDeleteHandler = class KeyResultUpdateBulKDeleteHandler {
    constructor(keyResultUpdateService) {
        this.keyResultUpdateService = keyResultUpdateService;
    }
    async execute(command) {
        const { id } = command;
        const updates = await this.keyResultUpdateService.findByKeyResultId(id);
        await this.keyResultUpdateService.deleteMany(updates.map((item) => item.id));
        return;
    }
};
exports.KeyResultUpdateBulKDeleteHandler = KeyResultUpdateBulKDeleteHandler;
exports.KeyResultUpdateBulKDeleteHandler = KeyResultUpdateBulKDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(__1.KeyResultUpdateBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [keyresult_update_service_1.KeyResultUpdateService])
], KeyResultUpdateBulKDeleteHandler);
//# sourceMappingURL=keyresult-update.bulk.delete.handler.js.map