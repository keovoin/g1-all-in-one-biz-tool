"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCamshotCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const camshot_service_1 = require("../../services/camshot.service");
const delete_camshot_command_1 = require("../delete-camshot.command");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
let DeleteCamshotCommandHandler = class DeleteCamshotCommandHandler {
    constructor(camshotService) {
        this.camshotService = camshotService;
    }
    /**
     * Handles the `DeleteCamshotCommand` to delete a camshot entity from the database.
     * Validates the existence of the camshot and performs the deletion based on the provided criteria.
     *
     * @param command - The `DeleteCamshotCommand` containing the camshot ID and additional options for deletion.
     *
     * @returns A promise that resolves when the camshot is successfully deleted.
     *
     * @throws {NotFoundException} If the camshot with the specified ID does not exist.
     */
    async execute(command) {
        const { id, input } = command;
        const { forceDelete = false, organizationId, tenantId = core_1.RequestContext.currentTenantId() } = input;
        const camshot = await this.camshotService.findOneByOptions({
            where: { id, organizationId, tenantId },
            withDeleted: true
        });
        if (!camshot) {
            throw new common_1.NotFoundException(`Cannot delete because camshot with id ${id} not found`);
        }
        if (forceDelete) {
            await this.camshotService.delete(id, { withDeleted: true });
        }
        else {
            await this.camshotService.softDelete(id);
        }
    }
};
exports.DeleteCamshotCommandHandler = DeleteCamshotCommandHandler;
exports.DeleteCamshotCommandHandler = DeleteCamshotCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_camshot_command_1.DeleteCamshotCommand),
    tslib_1.__metadata("design:paramtypes", [camshot_service_1.CamshotService])
], DeleteCamshotCommandHandler);
//# sourceMappingURL=delete-camshot-command.handler.js.map