import { ICommandHandler } from '@nestjs/cqrs';
import { TimeOffRequest } from '../../time-off-request.entity';
import { RequestApprovalService } from '../../../request-approval/request-approval.service';
import { TimeOffCreateCommand } from '../time-off.create.command';
import { TimeOffRequestService } from '../../time-off-request.service';
export declare class TimeOffCreateHandler implements ICommandHandler<TimeOffCreateCommand> {
    private readonly _timeOffRequestService;
    private readonly _requestApprovalService;
    constructor(_timeOffRequestService: TimeOffRequestService, _requestApprovalService: RequestApprovalService);
    /**
     * Executes the time off update command.
     *
     * @param command - The command containing the time off request data.
     * @returns The saved TimeOffRequest entity.
     */
    execute(command: TimeOffCreateCommand): Promise<TimeOffRequest>;
}
