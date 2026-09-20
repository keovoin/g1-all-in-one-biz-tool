"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const time_off_update_command_1 = require("../time-off.update.command");
const request_approval_service_1 = require("../../../request-approval/request-approval.service");
const time_off_request_service_1 = require("../../time-off-request.service");
let TimeOffUpdateHandler = class TimeOffUpdateHandler {
    constructor(_requestApprovalService, _timeOffRequestService) {
        this._requestApprovalService = _requestApprovalService;
        this._timeOffRequestService = _timeOffRequestService;
    }
    /**
     * Updates an existing time off request by deleting the old record, saving a new one,
     * and updating its associated approval record.
     *
     * @param command - An object containing the identifier of the existing request and the new time off data.
     * @returns A promise that resolves to the newly saved TimeOffRequest.
     */
    async execute(command) {
        const { id, input } = command;
        try {
            // Delete the existing time off request and its associated request approval concurrently.
            await Promise.all([
                this._timeOffRequestService.delete(id),
                this._requestApprovalService.delete({ requestId: id })
            ]);
            // Save the new time off request.
            const timeOffRequest = await this._timeOffRequestService.create(input);
            // Create a new request approval record for the updated time off request.
            await this._requestApprovalService.create({
                requestId: timeOffRequest.id,
                status: timeOffRequest.status
                    ? contracts_1.StatusTypesMapRequestApprovalEnum[timeOffRequest.status]
                    : contracts_1.RequestApprovalStatusTypesEnum.REQUESTED,
                name: 'Request time off',
                min_count: 1
            });
            return timeOffRequest;
        }
        catch (error) {
            throw new common_1.HttpException(`Error while updating time off request: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TimeOffUpdateHandler = TimeOffUpdateHandler;
exports.TimeOffUpdateHandler = TimeOffUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_off_update_command_1.TimeOffUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [request_approval_service_1.RequestApprovalService,
        time_off_request_service_1.TimeOffRequestService])
], TimeOffUpdateHandler);
//# sourceMappingURL=time-off.update.handler.js.map