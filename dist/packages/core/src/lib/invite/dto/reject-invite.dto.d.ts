import { IUserCodeInput, IUserEmailInput, IUserTokenInput } from '@gauzy/contracts';
import { UserCodeDTO, UserEmailDTO, UserTokenDTO } from './../../user/dto';
declare const RejectInviteDTO_base: import("@nestjs/common").Type<UserEmailDTO & UserTokenDTO & UserCodeDTO>;
/**
 * Reject invite DTO validation
 */
export declare class RejectInviteDTO extends RejectInviteDTO_base implements IUserEmailInput, IUserCodeInput, IUserTokenInput {
}
export {};
