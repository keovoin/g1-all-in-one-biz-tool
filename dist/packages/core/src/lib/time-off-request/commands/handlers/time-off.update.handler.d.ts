import { ICommandHandler } from '@nestjs/cqrs';
import { TimeOffRequest } from '../../time-off-request.entity';
import { TimeOffUpdateCommand } from '../time-off.update.command';
import { RequestApprovalService } from '../../../request-approval/request-approval.service';
import { TimeOffRequestService } from '../../time-off-request.service';
export declare class TimeOffUpdateHandler implements ICommandHandler<TimeOffUpdateCommand> {
    private readonly _requestApprovalService;
    private readonly _timeOffRequestService;
    constructor(_requestApprovalService: RequestApprovalService, _timeOffRequestService: TimeOffRequestService);
    /**
     * Updates an existing time off request by deleting the old record, saving a new one,
     * and updating its associated approval record.
     *
     * @param command - An object containing the identifier of the existing request and the new time off data.
     * @returns A promise that resolves to the newly saved TimeOffRequest.
     */
    execute(command: TimeOffUpdateCommand): Promise<TimeOffRequest>;
}
