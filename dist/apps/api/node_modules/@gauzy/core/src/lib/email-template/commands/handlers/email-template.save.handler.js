"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateSaveHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const email_template_save_command_1 = require("../email-template.save.command");
const email_template_service_1 = require("../../email-template.service");
const email_template_entity_1 = require("../../email-template.entity");
const mjml2html = require("mjml");
const common_1 = require("@nestjs/common");
const context_1 = require("./../../../core/context");
let EmailTemplateSaveHandler = class EmailTemplateSaveHandler {
    constructor(emailTemplateService) {
        this.emailTemplateService = emailTemplateService;
    }
    async execute(command) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const { input: { languageCode, name, organizationId, mjml, subject } } = command;
        try {
            await this._saveTemplate(languageCode, name, organizationId, tenantId, mjml, 'html');
        }
        catch (error) {
            // TODO add translation
            throw new common_1.BadRequestException('Invalid html template');
        }
        return this._saveTemplate(languageCode, name, organizationId, tenantId, subject, 'subject');
    }
    async _saveTemplate(languageCode, name, organizationId, tenantId, content, type) {
        const { success: found, record } = await this.emailTemplateService.findOneOrFailByWhereOptions({
            languageCode,
            name: `${name}/${type}`,
            // No organization means the tenant-wide row (organizationId IS NULL) — never "any
            // organization": EmailTemplateService is not tenant-scoped, and a dropped predicate here
            // would pick (and then overwrite) another organization's template of the same name.
            organizationId: (0, utils_1.isEmpty)(organizationId) ? (0, typeorm_1.IsNull)() : organizationId,
            tenantId: (0, utils_1.isEmpty)(tenantId) ? (0, typeorm_1.IsNull)() : tenantId
        });
        let entity;
        if (found) {
            switch (type) {
                case 'subject':
                    entity = {
                        ...record,
                        hbs: content
                    };
                    break;
                case 'html':
                    entity = {
                        ...record,
                        mjml: content,
                        hbs: mjml2html(content).html
                    };
                    break;
            }
            if (`title` in entity) {
                delete entity['title'];
            }
            await this.emailTemplateService.update(record.id, entity);
        }
        else {
            entity = new email_template_entity_1.EmailTemplate();
            entity.organizationId = organizationId;
            entity.tenantId = tenantId;
            entity.languageCode = languageCode;
            entity.name = `${name}/${type}`;
            switch (type) {
                case 'subject':
                    entity.hbs = content;
                    break;
                case 'html':
                    entity.mjml = content;
                    entity.hbs = mjml2html(content).html;
                    break;
            }
            await this.emailTemplateService.create(entity);
        }
        return entity;
    }
};
exports.EmailTemplateSaveHandler = EmailTemplateSaveHandler;
exports.EmailTemplateSaveHandler = EmailTemplateSaveHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(email_template_save_command_1.EmailTemplateSaveCommand),
    tslib_1.__metadata("design:paramtypes", [email_template_service_1.EmailTemplateService])
], EmailTemplateSaveHandler);
//# sourceMappingURL=email-template.save.handler.js.map