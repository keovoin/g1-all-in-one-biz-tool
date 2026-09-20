"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const request_approval_service_1 = require("../../../request-approval/request-approval.service");
const time_off_create_command_1 = require("../time-off.create.command");
const time_off_request_service_1 = require("../../time-off-request.service");
let TimeOffCreateHandler = class TimeOffCreateHandler {
    constructor(_timeOffRequestService, _requestApprovalService) {
        this._timeOffRequestService = _timeOffRequestService;
        this._requestApprovalService = _requestApprovalService;
    }
    /**
     * Executes the time off update command.
     *
     * @param command - The command containing the time off request data.
     * @returns The saved TimeOffRequest entity.
     */
    async execute(command) {
        const { input } = command;
        try {
            // Create the request approval record for the created equipment sharing.
            const timeOffRequest = await this._timeOffRequestService.create(input);
            // Create the request approval record for the created equipment sharing.
            await this._requestApprovalService.create({
                requestId: timeOffRequest.id,
                requestType: contracts_1.ApprovalPolicyTypesStringEnum.TIME_OFF,
                status: timeOffRequest.status
                    ? contracts_1.StatusTypesMapRequestApprovalEnum[timeOffRequest.status]
                    : contracts_1.RequestApprovalStatusTypesEnum.REQUESTED,
                name: 'Request time off',
                min_count: 1
            });
            return timeOffRequest;
        }
        catch (error) {
            throw new common_1.HttpException(`Error while creating time off request: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TimeOffCreateHandler = TimeOffCreateHandler;
exports.TimeOffCreateHandler = TimeOffCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(time_off_create_command_1.TimeOffCreateCommand),
    tslib_1.__metadata("design:paramtypes", [time_off_request_service_1.TimeOffRequestService,
        request_approval_service_1.RequestApprovalService])
], TimeOffCreateHandler);
//# sourceMappingURL=time-off.create.handler.js.map