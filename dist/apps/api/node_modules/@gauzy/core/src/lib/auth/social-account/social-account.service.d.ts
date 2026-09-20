import { DeepPartial } from 'typeorm';
import { ISocialAccount, ISocialAccountBase, IUser } from '@gauzy/contracts';
import { UserService } from '../../user/user.service';
import { TenantAwareCrudService } from '../../core/crud';
import { SocialAccount } from './social-account.entity';
import { TypeOrmSocialAccountRepository } from './repository/type-orm-social-account.repository';
import { MikroOrmSocialAccountRepository } from './repository/mikro-orm-social-account.repository';
export declare class SocialAccountService extends TenantAwareCrudService<SocialAccount> {
    readonly typeOrmSocialAccountRepository: TypeOrmSocialAccountRepository;
    readonly mikroOrmSocialAccountRepository: MikroOrmSocialAccountRepository;
    private readonly userService;
    constructor(typeOrmSocialAccountRepository: TypeOrmSocialAccountRepository, mikroOrmSocialAccountRepository: MikroOrmSocialAccountRepository, userService: UserService);
    /**
     * Registers a new social account by saving or updating the given entity.
     * Uses the ORM-agnostic base class save() method.
     */
    registerSocialAccount(partialEntity: DeepPartial<ISocialAccount>): Promise<ISocialAccount>;
    /**
     * Finds a social account by provider and providerAccountId.
     * Uses ORM switch to support both TypeORM and MikroORM, returning null when not found.
     */
    findAccountByProvider(input: ISocialAccountBase): Promise<SocialAccount | null>;
    findUserBySocialId(input: ISocialAccountBase): Promise<IUser>;
    signupFindUserByEmail(email: string): Promise<boolean>;
}
