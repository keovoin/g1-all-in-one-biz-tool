import { IApprovalPolicy } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { BaseQueryDTO } from './../../core/crud';
export declare class ApprovalPolicyGetCommand implements ICommand {
    readonly input: BaseQueryDTO<IApprovalPolicy>;
    static readonly type = "[Approval Policy] Get";
    constructor(input: BaseQueryDTO<IApprovalPolicy>);
}
