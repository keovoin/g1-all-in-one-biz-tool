"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateRenderService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const Handlebars = require("handlebars");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const utils_2 = require("./utils");
const type_orm_email_template_repository_1 = require("./../email-template/repository/type-orm-email-template.repository");
const type_orm_custom_smtp_repository_1 = require("./../custom-smtp/repository/type-orm-custom-smtp.repository");
let EmailTemplateRenderService = class EmailTemplateRenderService {
    constructor(typeOrmEmailTemplateRepository, typeOrmCustomSmtpRepository) {
        this.typeOrmEmailTemplateRepository = typeOrmEmailTemplateRepository;
        this.typeOrmCustomSmtpRepository = typeOrmCustomSmtpRepository;
        /**
         * Renders an email template based on the provided view and locals.
         * @param view The name of the email template to render.
         * @param locals Local variables to be used in the template rendering.
         * @returns The rendered HTML content of the email template.
         */
        this.render = async (view, locals) => {
            let smtpTransporter;
            let isValidSmtp = false;
            try {
                smtpTransporter = await this.typeOrmCustomSmtpRepository.findOneOrFail({
                    where: {
                        organizationId: (0, utils_1.isEmpty)(locals.organizationId) ? (0, typeorm_1.IsNull)() : locals.organizationId,
                        tenantId: (0, utils_1.isEmpty)(locals.tenantId) ? (0, typeorm_1.IsNull)() : locals.tenantId
                    },
                    order: {
                        createdAt: 'DESC'
                    }
                });
            }
            catch (error) {
                smtpTransporter = await this.typeOrmCustomSmtpRepository.findOne({
                    where: {
                        organizationId: (0, typeorm_1.IsNull)(),
                        tenantId: (0, utils_1.isEmpty)(locals.tenantId) ? (0, typeorm_1.IsNull)() : locals.tenantId
                    },
                    order: {
                        createdAt: 'DESC'
                    }
                });
            }
            if (smtpTransporter) {
                /** */
                try {
                    const smtpConfig = smtpTransporter.getSmtpTransporter();
                    const transport = utils_2.SMTPUtils.convertSmtpToTransporter(smtpConfig);
                    isValidSmtp = !!(await utils_2.SMTPUtils.verifyTransporter(transport));
                }
                catch (error) {
                    isValidSmtp = false;
                }
            }
            try {
                view = view.replace('\\', '/');
                let emailTemplate;
                // Find email template customized for the given organization
                const query = new Object({
                    name: view,
                    languageCode: locals.locale || contracts_1.LanguagesEnum.ENGLISH
                });
                if (!!isValidSmtp) {
                    // Same NULL handling as the SMTP lookup above: a missing organization / tenant selects
                    // the tenant-wide / global row, never "any organization's" template.
                    query['organizationId'] = (0, utils_1.isEmpty)(locals.organizationId) ? (0, typeorm_1.IsNull)() : locals.organizationId;
                    query['tenantId'] = (0, utils_1.isEmpty)(locals.tenantId) ? (0, typeorm_1.IsNull)() : locals.tenantId;
                    emailTemplate = await this.typeOrmEmailTemplateRepository.findOneBy(query);
                }
                // If no email template found for the organization, use the default template
                if (!emailTemplate) {
                    query['organizationId'] = (0, typeorm_1.IsNull)();
                    query['tenantId'] = (0, typeorm_1.IsNull)();
                    emailTemplate = await this.typeOrmEmailTemplateRepository.findOneBy(query);
                }
                if (!emailTemplate) {
                    return '';
                }
                const template = Handlebars.compile(emailTemplate.hbs);
                const html = template(locals);
                return html;
            }
            catch (error) {
                console.log('Error while rendering email template: %s', error);
                throw new common_1.InternalServerErrorException(error);
            }
        };
    }
};
exports.EmailTemplateRenderService = EmailTemplateRenderService;
exports.EmailTemplateRenderService = EmailTemplateRenderService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_email_template_repository_1.TypeOrmEmailTemplateRepository,
        type_orm_custom_smtp_repository_1.TypeOrmCustomSmtpRepository])
], EmailTemplateRenderService);
//# sourceMappingURL=email-template-render.service.js.map