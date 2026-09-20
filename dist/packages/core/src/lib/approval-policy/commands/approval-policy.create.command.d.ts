import { IApprovalPolicyCreateInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class ApprovalPolicyCreateCommand implements ICommand {
    readonly input: IApprovalPolicyCreateInput;
    static readonly type = "[ApprovalPolicy] Create";
    constructor(input: IApprovalPolicyCreateInput);
}
