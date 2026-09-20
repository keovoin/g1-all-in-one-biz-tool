import { User } from '../../core/entities/internal';
import { ILastOrganization, ILastTeam, IUserCodeInput, IUserEmailInput, IUserTokenInput } from '@gauzy/contracts';
import { UserCodeDTO, UserEmailDTO, UserTokenDTO } from '../../user/dto';
import { IncludeTeamsDTO } from '../../user/dto/include-teams.dto';
declare const WorkspaceSigninEmailVerifyDTO_base: import("@nestjs/common").Type<UserEmailDTO & IncludeTeamsDTO & UserCodeDTO>;
export declare class WorkspaceSigninEmailVerifyDTO extends WorkspaceSigninEmailVerifyDTO_base implements IUserEmailInput, IUserCodeInput {
}
declare const WorkspaceSigninDTO_base: import("@nestjs/common").Type<UserEmailDTO & UserTokenDTO & Pick<User, "lastTeamId" | "lastOrganizationId">>;
export declare class WorkspaceSigninDTO extends WorkspaceSigninDTO_base implements IUserEmailInput, IUserTokenInput, ILastTeam, ILastOrganization {
}
export {};
