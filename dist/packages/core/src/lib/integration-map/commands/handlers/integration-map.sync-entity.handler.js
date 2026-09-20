"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMapSyncEntityHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const __1 = require("..");
const integration_map_service_1 = require("../../integration-map.service");
let IntegrationMapSyncEntityHandler = class IntegrationMapSyncEntityHandler {
    constructor(_integrationMapService) {
        this._integrationMapService = _integrationMapService;
    }
    async execute(command) {
        const { input } = command;
        return await this._integrationMapService.create(input);
    }
};
exports.IntegrationMapSyncEntityHandler = IntegrationMapSyncEntityHandler;
exports.IntegrationMapSyncEntityHandler = IntegrationMapSyncEntityHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(__1.IntegrationMapSyncEntityCommand),
    tslib_1.__metadata("design:paramtypes", [integration_map_service_1.IntegrationMapService])
], IntegrationMapSyncEntityHandler);
//# sourceMappingURL=integration-map.sync-entity.handler.js.map