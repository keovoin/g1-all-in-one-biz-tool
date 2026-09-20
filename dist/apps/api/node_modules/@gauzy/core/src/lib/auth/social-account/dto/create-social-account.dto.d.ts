import { ID, ISocialAccountCreateInput, ProviderEnum } from '@gauzy/contracts';
import { TenantBaseDTO } from '../../../core/dto';
import { CreateUserDTO } from '../../../user/dto';
declare const CreateSocialAccountDTO_base: import("@nestjs/common").Type<TenantBaseDTO>;
/**
 * Create Social Account DTO validation
 */
export declare class CreateSocialAccountDTO extends CreateSocialAccountDTO_base implements ISocialAccountCreateInput {
    /**
     * Create user to the social account
     */
    readonly user: CreateUserDTO;
    /**
     * Sync user to the social account
     */
    readonly userId: ID;
    /**
     * Social account provider
     */
    readonly provider: ProviderEnum;
    /**
     * Social account provider account id
     */
    readonly providerAccountId: string;
}
export {};
