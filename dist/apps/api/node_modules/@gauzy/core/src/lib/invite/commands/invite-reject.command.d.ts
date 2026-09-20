import { ICommand } from '@nestjs/cqrs';
import { IInviteRejectInput } from '@gauzy/contracts';
/**
 * Reject invite command
 */
export declare class InviteRejectCommand implements ICommand {
    readonly input: IInviteRejectInput;
    static readonly type = "[Invite Employee/User/Candidate] Reject";
    constructor(input: IInviteRejectInput);
}
