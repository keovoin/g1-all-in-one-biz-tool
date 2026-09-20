"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSoundshotCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const soundshot_service_1 = require("../../services/soundshot.service");
const delete_soundshot_command_1 = require("../delete-soundshot.command");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
let DeleteSoundshotCommandHandler = class DeleteSoundshotCommandHandler {
    constructor(soundshotService) {
        this.soundshotService = soundshotService;
    }
    /**
     * Handles the `DeleteSoundshotCommand` to delete a soundshot entity from the database.
     * Validates the existence of the soundshot and performs the deletion based on the provided criteria.
     *
     * @param command - The `DeleteSoundshotCommand` containing the soundshot ID and additional options for deletion.
     *
     * @returns A promise that resolves when the soundshot is successfully deleted.
     *
     * @throws {NotFoundException} If the soundshot with the specified ID does not exist.
     */
    async execute(command) {
        const { id, input } = command;
        const { forceDelete = false, organizationId, tenantId = core_1.RequestContext.currentTenantId() } = input;
        if (!tenantId) {
            throw new common_1.BadRequestException(`Tenant ID ${tenantId} is required for deleting soundshot.`);
        }
        const soundshot = await this.soundshotService.findOneByOptions({
            where: { id, organizationId, tenantId },
            withDeleted: true
        });
        if (!soundshot) {
            throw new common_1.NotFoundException(`Soundshot with ID ${id} not found`);
        }
        if (forceDelete) {
            await this.soundshotService.delete(id);
        }
        else {
            await this.soundshotService.softDelete(id);
        }
    }
};
exports.DeleteSoundshotCommandHandler = DeleteSoundshotCommandHandler;
exports.DeleteSoundshotCommandHandler = DeleteSoundshotCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_soundshot_command_1.DeleteSoundshotCommand),
    tslib_1.__metadata("design:paramtypes", [soundshot_service_1.SoundshotService])
], DeleteSoundshotCommandHandler);
//# sourceMappingURL=delete-soundshot-command.handler.js.map