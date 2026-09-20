"use strict";
var CustomTrackingBulkCreateHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTrackingBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const custom_tracking_bulk_create_command_1 = require("../custom-tracking-bulk-create.command");
const process_tracking_data_command_1 = require("../process-tracking-data.command");
/**
 * Handler for bulk creation of custom tracking data
 * Processes multiple tracking data entries sequentially to maintain data consistency
 */
let CustomTrackingBulkCreateHandler = CustomTrackingBulkCreateHandler_1 = class CustomTrackingBulkCreateHandler {
    constructor(commandBus) {
        this.commandBus = commandBus;
        this.logger = new common_1.Logger(CustomTrackingBulkCreateHandler_1.name);
    }
    /**
     * Execute bulk creation of custom tracking data
     * @param command The bulk create command containing array of tracking data inputs
     * @returns Promise resolving to array of results for each processed entry
     */
    async execute(command) {
        const { input } = command;
        const results = [];
        this.logger.log(`Processing bulk custom tracking data: ${input.length} entries`);
        for (let i = 0; i < input.length; i++) {
            const entry = input[i];
            try {
                if (entry.startTime && isNaN(new Date(entry.startTime).getTime())) {
                    throw new common_1.BadRequestException(`Invalid start time at index ${i}`);
                }
                // Execute individual tracking data processing command
                const startTime = entry.startTime ? new Date(entry.startTime) : undefined;
                const result = await this.commandBus.execute(new process_tracking_data_command_1.ProcessTrackingDataCommand({
                    ...entry,
                    ...(startTime ? { startTime } : {})
                }));
                results.push({
                    ...result,
                    index: i
                });
                this.logger.debug(`Successfully processed entry ${i + 1}/${input.length}`);
            }
            catch (error) {
                this.logger.error(`Failed to process entry ${i + 1}/${input.length}: ${error.message}`, error.stack);
                results.push({
                    success: false,
                    sessionId: '',
                    timeSlotId: '',
                    message: `Failed to process entry: ${error.message}`,
                    session: null,
                    index: i,
                    error: error.message
                });
            }
        }
        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.length - successCount;
        this.logger.log(`Bulk processing completed: ${successCount} successful, ${failureCount} failed`);
        return results;
    }
};
exports.CustomTrackingBulkCreateHandler = CustomTrackingBulkCreateHandler;
exports.CustomTrackingBulkCreateHandler = CustomTrackingBulkCreateHandler = CustomTrackingBulkCreateHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(custom_tracking_bulk_create_command_1.CustomTrackingBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], CustomTrackingBulkCreateHandler);
//# sourceMappingURL=custom-tracking-bulk-create.handler.js.map