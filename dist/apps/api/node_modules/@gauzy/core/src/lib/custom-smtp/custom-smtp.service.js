"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtpService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const utils_2 = require("./../email-send/utils");
const type_orm_custom_smtp_repository_1 = require("./repository/type-orm-custom-smtp.repository");
const mikro_orm_custom_smtp_repository_1 = require("./repository/mikro-orm-custom-smtp.repository");
let CustomSmtpService = class CustomSmtpService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCustomSmtpRepository, mikroOrmCustomSmtpRepository) {
        super(typeOrmCustomSmtpRepository, mikroOrmCustomSmtpRepository);
        this.typeOrmCustomSmtpRepository = typeOrmCustomSmtpRepository;
        this.mikroOrmCustomSmtpRepository = mikroOrmCustomSmtpRepository;
    }
    /**
     * Retrieves SMTP settings for a given tenant/organization.
     *
     * @param {ICustomSmtpFindInput} query - The query parameters containing organizationId.
     * @returns {Promise<ICustomSmtp | ISMTPConfig>} - The SMTP settings or default settings if an error occurs.
     */
    async getSmtpSetting(query) {
        const { organizationId } = query;
        try {
            return await this.findOneByOptions({
                where: { organizationId: (0, utils_1.isEmpty)(organizationId) ? (0, typeorm_1.IsNull)() : organizationId },
                order: { createdAt: 'DESC' }
            });
        }
        catch {
            // Return default SMTP settings if an error occurs
            return utils_2.SMTPUtils.defaultSMTPTransporter(false);
        }
    }
    /**
     * Verifies SMTP configuration
     *
     * @param configuration
     * @returns
     */
    async verifyTransporter(transport) {
        try {
            return !!(await utils_2.SMTPUtils.verifyTransporter(transport));
        }
        catch (error) {
            console.log('Error while verifying nodemailer transport: %s', error?.message);
            return false;
        }
    }
};
exports.CustomSmtpService = CustomSmtpService;
exports.CustomSmtpService = CustomSmtpService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_custom_smtp_repository_1.TypeOrmCustomSmtpRepository,
        mikro_orm_custom_smtp_repository_1.MikroOrmCustomSmtpRepository])
], CustomSmtpService);
//# sourceMappingURL=custom-smtp.service.js.map