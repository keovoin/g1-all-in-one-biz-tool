"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTypeGetHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const integration_type_get_command_1 = require("../integration-type.get.command");
const integration_type_service_1 = require("../../integration-type.service");
let IntegrationTypeGetHandler = class IntegrationTypeGetHandler {
    constructor(_integrationTypeService) {
        this._integrationTypeService = _integrationTypeService;
    }
    /**
     * Executes the `IntegrationTypeGetCommand` to retrieve all integration types.
     *
     * @param {IntegrationTypeGetCommand} command - The command to fetch integration types (unused but kept for consistency).
     * @returns {Promise<IIntegrationType[]>} - A promise resolving to a list of integration types ordered by `order` in ascending order.
     *
     * @description
     * This method queries the database to fetch all integration types and sorts them by the `order` field in ascending order.
     *
     * @example
     * ```ts
     * const integrationTypes = await integrationTypeService.execute(new IntegrationTypeGetCommand());
     * console.log(integrationTypes);
     * ```
     */
    async execute(command) {
        return this._integrationTypeService.find({
            order: { order: 'ASC' }
        });
    }
};
exports.IntegrationTypeGetHandler = IntegrationTypeGetHandler;
exports.IntegrationTypeGetHandler = IntegrationTypeGetHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(integration_type_get_command_1.IntegrationTypeGetCommand),
    tslib_1.__metadata("design:paramtypes", [integration_type_service_1.IntegrationTypeService])
], IntegrationTypeGetHandler);
//# sourceMappingURL=integration-type.get.handler.js.map