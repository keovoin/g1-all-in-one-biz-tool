import { IApprovalPolicy, IPagination } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { ApprovalPolicyService } from '../../approval-policy.service';
import { ApprovalPolicyGetCommand } from '../approval-policy.get.command';
export declare class ApprovalPolicyGetHandler implements ICommandHandler<ApprovalPolicyGetCommand> {
    private readonly approvalPolicyService;
    constructor(approvalPolicyService: ApprovalPolicyService);
    execute(command: ApprovalPolicyGetCommand): Promise<IPagination<IApprovalPolicy>>;
}
