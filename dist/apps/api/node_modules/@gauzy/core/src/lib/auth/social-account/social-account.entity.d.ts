import { EntityRepositoryType } from '@mikro-orm/core';
import { ID, ISocialAccount, IUser, ProviderEnum } from '@gauzy/contracts';
import { TenantBaseEntity } from '../../core/entities/internal';
import { MikroOrmSocialAccountRepository } from './repository/mikro-orm-social-account.repository';
export declare class SocialAccount extends TenantBaseEntity implements ISocialAccount {
    [EntityRepositoryType]?: MikroOrmSocialAccountRepository;
    provider: ProviderEnum;
    providerAccountId: string;
    /**
     * User
     */
    user?: IUser;
    userId?: ID;
}
