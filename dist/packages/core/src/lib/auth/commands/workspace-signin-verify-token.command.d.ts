import { ILastOrganization, ILastTeam, IUserEmailInput, IUserTokenInput } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class WorkspaceSigninVerifyTokenCommand implements ICommand {
    readonly input: IUserEmailInput & IUserTokenInput & ILastOrganization & ILastTeam;
    static readonly type = "[Password Less] Workspace Signin Verify Token";
    constructor(input: IUserEmailInput & IUserTokenInput & ILastOrganization & ILastTeam);
}
