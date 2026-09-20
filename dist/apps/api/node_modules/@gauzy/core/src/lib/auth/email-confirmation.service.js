"use strict";
var EmailConfirmationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfirmationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const request_context_1 = require("./../core/context/request-context");
const email_service_1 = require("./../email-send/email.service");
const user_service_1 = require("./../user/user.service");
const feature_service_1 = require("./../feature/feature.service");
const password_hash_service_1 = require("../password-hash/password-hash.service");
let EmailConfirmationService = EmailConfirmationService_1 = class EmailConfirmationService {
    constructor(emailService, userService, featureFlagService, passwordHashService) {
        this.emailService = emailService;
        this.userService = userService;
        this.featureFlagService = featureFlagService;
        this.passwordHashService = passwordHashService;
        this.logger = new common_1.Logger(EmailConfirmationService_1.name);
    }
    /**
     * Sends an email verification link and code to the user.
     *
     * @param user The user to send the verification email to.
     * @param integration Configuration for app integration.
     */
    async sendEmailVerification(user, integration) {
        if (!(await this.featureFlagService.isFeatureEnabled(contracts_1.FeatureEnum.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }
        try {
            const { id, email } = user;
            const payload = { id, email };
            // Generate a JWT token for email verification
            const token = (0, jsonwebtoken_1.sign)(payload, config_1.environment.JWT_VERIFICATION_TOKEN_SECRET, {
                expiresIn: `${config_1.environment.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
            });
            // Override the default config by merging in the provided values.
            const appIntegration = (0, utils_1.deepMerge)(config_1.environment.appIntegrationConfig, integration);
            const verificationLink = `${appIntegration.appEmailConfirmationUrl}?email=${email}&token=${token}`;
            const verificationCode = (0, utils_1.generateAlphaNumericCode)();
            // Update user's email token field and verification code
            // Always set codeExpireAt — default to 7 days to match the environment module default
            const verificationExpiry = config_1.environment.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME || 86400 * 7;
            await this.userService.update(id, {
                emailToken: await this.passwordHashService.hash(token),
                code: verificationCode,
                codeExpireAt: moment(new Date()).add(verificationExpiry, 'seconds').toDate()
            });
            // Send email verification link
            return await this.emailService.emailVerification(user, verificationLink, verificationCode, appIntegration);
        }
        catch (error) {
            this.logger.error('Error while sending verification email', error?.stack);
        }
    }
    /**
     * Resend confirmation email link
     *
     */
    async resendConfirmationLink(config) {
        if (!(await this.featureFlagService.isFeatureEnabled(contracts_1.FeatureEnum.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }
        try {
            const user = await this.userService.getIfExists(request_context_1.RequestContext.currentUserId());
            if (!!user.emailVerifiedAt) {
                throw new common_1.BadRequestException('Your email is already verified.');
            }
            await this.sendEmailVerification(user, config);
            return new Object({
                status: common_1.HttpStatus.OK,
                message: `OK`
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error?.message);
        }
    }
    /**
     * Decode email confirmation token
     *
     * @param token
     * @returns
     */
    async decodeConfirmationToken(token) {
        if (!(await this.featureFlagService.isFeatureEnabled(contracts_1.FeatureEnum.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }
        try {
            const payload = (0, jsonwebtoken_1.verify)(token, config_1.environment.JWT_VERIFICATION_TOKEN_SECRET);
            if (typeof payload === 'object' && 'email' in payload && 'id' in payload) {
                const { id, email } = payload;
                const user = await this.userService.findOneByOptions({
                    where: {
                        id,
                        email
                    }
                });
                if (!!user.emailVerifiedAt) {
                    throw new common_1.BadRequestException('Your email is already verified.');
                }
                if (!!user.emailToken && !!(await this.passwordHashService.verify(token, user.emailToken))) {
                    return user;
                }
            }
            throw new common_1.BadRequestException('Failed to verify email.');
        }
        catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new common_1.BadRequestException('JWT token has been expired.');
            }
            throw new common_1.BadRequestException(error?.message);
        }
    }
    /**
     * Email confirmation by code
     *
     * @param payload
     * @returns
     */
    async confirmationByCode(payload) {
        if (!(await this.featureFlagService.isFeatureEnabled(contracts_1.FeatureEnum.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }
        try {
            const { email, code, tenantId } = payload;
            if (email && code && tenantId) {
                const user = await this.userService.findOneByOptions({
                    where: {
                        email,
                        code,
                        tenantId,
                        codeExpireAt: (0, typeorm_1.MoreThanOrEqual)(new Date())
                    }
                });
                if (!!user.emailVerifiedAt) {
                    throw new common_1.BadRequestException('Your email is already verified.');
                }
                // Atomically invalidate the verification code (prevent reuse / TOCTOU race) // cspell:ignore TOCTOU
                // The claim scopes by id AND code AND expiry, so a concurrent request that already
                // nullified the code matches zero rows. Scoping by id alone — as this did until now,
                // despite the comment claiming otherwise — is not a claim at all: both racers matched
                // their own row and both confirmed off one code.
                const claimed = await this.userService.claimEmailVerificationCode(user['id'], code, tenantId);
                if (!claimed) {
                    throw new common_1.BadRequestException('Failed to verify email.');
                }
                return user;
            }
            throw new common_1.BadRequestException('Failed to verify email.');
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to verify email.');
        }
    }
    /**
     * Confirm user email
     *
     * @param user
     */
    async confirmEmail(user) {
        if (!(await this.featureFlagService.isFeatureEnabled(contracts_1.FeatureEnum.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }
        try {
            await this.userService.markEmailAsVerified(user['id']);
        }
        finally {
            return new Object({
                status: common_1.HttpStatus.OK,
                message: `OK`
            });
        }
    }
};
exports.EmailConfirmationService = EmailConfirmationService;
exports.EmailConfirmationService = EmailConfirmationService = EmailConfirmationService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [email_service_1.EmailService,
        user_service_1.UserService,
        feature_service_1.FeatureService,
        password_hash_service_1.PasswordHashService])
], EmailConfirmationService);
//# sourceMappingURL=email-confirmation.service.js.map