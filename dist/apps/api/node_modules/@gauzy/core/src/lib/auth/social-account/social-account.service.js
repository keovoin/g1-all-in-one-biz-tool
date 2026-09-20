"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../user/user.service");
const crud_1 = require("../../core/crud");
const utils_1 = require("../../core/utils");
const type_orm_social_account_repository_1 = require("./repository/type-orm-social-account.repository");
const mikro_orm_social_account_repository_1 = require("./repository/mikro-orm-social-account.repository");
let SocialAccountService = class SocialAccountService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmSocialAccountRepository, mikroOrmSocialAccountRepository, userService) {
        super(typeOrmSocialAccountRepository, mikroOrmSocialAccountRepository);
        this.typeOrmSocialAccountRepository = typeOrmSocialAccountRepository;
        this.mikroOrmSocialAccountRepository = mikroOrmSocialAccountRepository;
        this.userService = userService;
    }
    /**
     * Registers a new social account by saving or updating the given entity.
     * Uses the ORM-agnostic base class save() method.
     */
    async registerSocialAccount(partialEntity) {
        try {
            return await this.save(partialEntity);
        }
        catch (error) {
            throw new common_1.BadRequestException('Could not create this account');
        }
    }
    /**
     * Finds a social account by provider and providerAccountId.
     * Uses ORM switch to support both TypeORM and MikroORM, returning null when not found.
     */
    async findAccountByProvider(input) {
        const { provider, providerAccountId } = input;
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                return (await this.mikroOrmRepository.findOne({ provider, providerAccountId, isActive: true, isArchived: false }, { populate: ['user'] }));
            }
            case utils_1.MultiORMEnum.TypeORM:
                return await this.typeOrmRepository.findOne({
                    where: { provider, providerAccountId, isActive: true, isArchived: false },
                    relations: { user: true }
                });
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    async findUserBySocialId(input) {
        try {
            const account = await this.findAccountByProvider(input);
            const user = account?.user;
            if (!user) {
                throw new common_1.BadRequestException('The user with this account details does not exists');
            }
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException('The user with this account details does not exists');
        }
    }
    async signupFindUserByEmail(email) {
        const user = await this.userService.getUserByEmail(email);
        if (!user)
            return false;
        return true;
    }
};
exports.SocialAccountService = SocialAccountService;
exports.SocialAccountService = SocialAccountService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_social_account_repository_1.TypeOrmSocialAccountRepository,
        mikro_orm_social_account_repository_1.MikroOrmSocialAccountRepository,
        user_service_1.UserService])
], SocialAccountService);
//# sourceMappingURL=social-account.service.js.map