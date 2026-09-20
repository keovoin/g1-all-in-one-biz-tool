"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSendService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const Email = require("email-templates");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../core/context");
const custom_smtp_service_1 = require("./../custom-smtp/custom-smtp.service");
const utils_2 = require("./utils");
const email_template_render_service_1 = require("./email-template-render.service");
let EmailSendService = class EmailSendService {
    constructor(customSmtpService, emailTemplateRenderService) {
        this.customSmtpService = customSmtpService;
        this.emailTemplateRenderService = emailTemplateRenderService;
    }
    /**
     * Retrieves an instance of the `Email` class by verifying the default SMTP transporter.
     *
     * - Fetches the default SMTP configuration.
     * - Converts the SMTP configuration to a transporter.
     * - Verifies the transporter.
     * - Returns an email instance if the transporter is valid.
     * - Throws an error if the verification fails.
     *
     * @returns {Promise<Email<any>>} A promise that resolves to an Email instance.
     * @throws {InternalServerErrorException} If there is an error while retrieving or verifying the SMTP configuration.
     */
    async getInstance() {
        try {
            // Fetch the default SMTP configuration
            const smtpConfig = utils_2.SMTPUtils.defaultSMTPTransporter();
            // Convert SMTP configuration to a transport object
            const transport = utils_2.SMTPUtils.convertSmtpToTransporter(smtpConfig);
            // console.log('Default SMTP configuration: %s', transport);
            // Verify the SMTP transporter
            if (!!(await utils_2.SMTPUtils.verifyTransporter(transport))) {
                // Return an Email instance with the validated SMTP configuration
                return this.getEmailConfig(smtpConfig);
            }
        }
        catch (error) {
            // Log and throw an internal server error
            console.log('Error while retrieving default global smtp configuration: %s', error?.message);
            throw new common_1.InternalServerErrorException(error);
        }
    }
    /**
     *
     * @param param0
     */
    async getEmailInstance({ organizationId, tenantId = context_1.RequestContext.currentTenantId() }) {
        let smtpTransporter;
        try {
            smtpTransporter = await this.customSmtpService.findOneByOptions({
                where: {
                    organizationId: (0, utils_1.isEmpty)(organizationId) ? (0, typeorm_1.IsNull)() : organizationId,
                    tenantId: (0, utils_1.isEmpty)(tenantId) ? (0, typeorm_1.IsNull)() : tenantId
                },
                order: {
                    createdAt: 'DESC'
                }
            });
            // console.log('Custom SMTP configuration for organization: %s', smtpTransporter);
            const smtpConfig = smtpTransporter.getSmtpTransporter();
            const transport = utils_2.SMTPUtils.convertSmtpToTransporter(smtpConfig);
            /** Verifies SMTP configuration */
            if (!!(await utils_2.SMTPUtils.verifyTransporter(transport))) {
                return this.getEmailConfig(smtpConfig);
            }
            else {
                console.log('SMTP configuration is not set for this tenant / organization: [%s, %s]', organizationId, tenantId);
                throw new common_1.BadRequestException('SMTP configuration is not set for this tenant / organization');
            }
        }
        catch (error) {
            try {
                if (error instanceof common_1.NotFoundException) {
                    smtpTransporter = await this.customSmtpService.findOneByOptions({
                        where: {
                            organizationId: (0, typeorm_1.IsNull)(),
                            tenantId: (0, utils_1.isEmpty)(tenantId) ? (0, typeorm_1.IsNull)() : tenantId
                        },
                        order: {
                            createdAt: 'DESC'
                        }
                    });
                    // console.log('Custom SMTP configuration for tenant: %s', smtpTransporter);
                    const smtpConfig = smtpTransporter.getSmtpTransporter();
                    const transport = utils_2.SMTPUtils.convertSmtpToTransporter(smtpConfig);
                    // /** Verifies SMTP configuration */
                    if (!!(await utils_2.SMTPUtils.verifyTransporter(transport))) {
                        return this.getEmailConfig(smtpConfig);
                    }
                    else {
                        console.log('SMTP configuration is not set for this tenant: %s', organizationId);
                        throw new common_1.BadRequestException('SMTP configuration is not set for this tenant');
                    }
                }
            }
            catch (error) {
                const smtpConfig = utils_2.SMTPUtils.defaultSMTPTransporter();
                const transport = utils_2.SMTPUtils.convertSmtpToTransporter(smtpConfig);
                // console.log('Default SMTP configuration: %s', transport);
                /** Verifies SMTP configuration */
                if (!!(await utils_2.SMTPUtils.verifyTransporter(transport))) {
                    return this.getEmailConfig(smtpConfig);
                }
                else {
                    console.log('Error while retrieving tenant/organization smtp configuration: %s', error?.message);
                    throw new common_1.InternalServerErrorException('Error while retrieving tenant/organization smtp configuration');
                }
            }
        }
    }
    /**
     *
     * @param smtpConfig
     * @returns
     */
    getEmailConfig(smtpConfig) {
        // Single source of truth for transport normalization
        const transport = utils_2.SMTPUtils.buildTransportFromSMTPConfig(smtpConfig);
        const config = {
            message: {
                from: smtpConfig.fromAddress || 'noreply@gauzy.co'
            },
            // if you want to send emails in development or test environments, set options.send to true.
            send: true,
            transport: transport,
            i18n: {},
            views: {
                options: {
                    extension: 'hbs'
                }
            },
            render: this.emailTemplateRenderService.render
        };
        /**
         * TODO: uncomment this after we figure out issues with dev / prod in the environment.*.ts
         */
        // if (!environment.production && !environment.demo) {
        //     config.preview = {
        //         open: {
        //             app: 'firefox',
        //             wait: false
        //         }
        //     };
        // }
        return new Email(config);
    }
};
exports.EmailSendService = EmailSendService;
exports.EmailSendService = EmailSendService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [custom_smtp_service_1.CustomSmtpService,
        email_template_render_service_1.EmailTemplateRenderService])
], EmailSendService);
//# sourceMappingURL=email-send.service.js.map