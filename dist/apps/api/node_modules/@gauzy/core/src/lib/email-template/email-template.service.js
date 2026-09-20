"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const mjml2html = require("mjml");
const utils_1 = require("@gauzy/utils");
const email_template_entity_1 = require("./email-template.entity");
const crud_1 = require("./../core/crud");
const utils_2 = require("./../core/utils");
const context_1 = require("./../core/context");
const database_helper_1 = require("./../database/database.helper");
const mikro_orm_email_template_repository_1 = require("./repository/mikro-orm-email-template.repository");
const type_orm_email_template_repository_1 = require("./repository/type-orm-email-template.repository");
let EmailTemplateService = class EmailTemplateService extends crud_1.CrudService {
    constructor(typeOrmEmailTemplateRepository, mikroOrmEmailTemplateRepository) {
        super(typeOrmEmailTemplateRepository, mikroOrmEmailTemplateRepository);
    }
    /**
     * Get Email Templates
     * @param params
     * @returns
     */
    async findAll(params) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(params);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                const { tenantId: mTenantIdParam, organizationId: mOrgId, languageCode: mLang } = params.where;
                const mTenantId = context_1.RequestContext.currentTenantId();
                const mWhere = {
                    $or: [
                        {
                            ...((0, utils_1.isNotEmpty)(mTenantId) ? { tenantId: mTenantId } : {}),
                            ...((0, utils_1.isNotEmpty)(mOrgId) ? { organizationId: mOrgId } : {}),
                            ...((0, utils_1.isNotEmpty)(mLang) ? { languageCode: mLang } : {})
                        },
                        {
                            organizationId: null,
                            tenantId: null
                        }
                    ]
                };
                const [mItems, mTotal] = await this.mikroOrmRepository.findAndCount(mWhere, {
                    ...(params?.relations ? { populate: Object.keys(params.relations) } : {}),
                    ...(params?.order ? { orderBy: params.order } : {})
                });
                return { items: mItems.map((item) => this.serialize(item)), total: mTotal };
            case utils_2.MultiORMEnum.TypeORM:
                const query = this.typeOrmRepository.createQueryBuilder('email_template');
                query.setFindOptions({
                    select: {
                        organization: {
                            id: true,
                            name: true,
                            brandColor: true
                        }
                    },
                    ...(params && params.relations
                        ? {
                            relations: params.relations
                        }
                        : {}),
                    ...(params && params.order
                        ? {
                            order: params.order
                        }
                        : {})
                });
                query.where((qb) => {
                    qb.where(new typeorm_1.Brackets((web) => {
                        const { tenantId, organizationId, languageCode } = params.where;
                        if ((0, utils_1.isNotEmpty)(tenantId)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), {
                                tenantId: context_1.RequestContext.currentTenantId()
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(organizationId)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), {
                                organizationId
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(languageCode)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."languageCode" = :languageCode`), {
                                languageCode
                            });
                        }
                    }));
                    qb.orWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" IS NULL`));
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" IS NULL`));
                    }));
                });
                const [items, total] = await query.getManyAndCount();
                return { items, total };
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Insert or update global missing email templates in database.
     * Production environment not running any seeder to save templates.
     * If someone looking for templates, we are fetch it from code folders.
     *
     * @param languageCode
     * @param name
     * @param type
     * @param organizationId
     * @param tenantId
     * @param content
     * @returns
     */
    async saveTemplate(languageCode, name, type, organizationId, tenantId, content) {
        let entity;
        try {
            // A missing organization / tenant means the GLOBAL template row (IS NULL) — say so with the
            // explicit operator. This service is a plain CrudService (no tenant scoping), and a literal
            // null used to be dropped from the SQL, so the "global" lookup matched — and then overwrote —
            // another tenant's template of the same name (GHSA-44pv-34gx-q9p4 class).
            const emailTemplate = await this.findOneByWhereOptions({
                languageCode,
                name: `${name}/${type}`,
                organizationId: (0, utils_1.isEmpty)(organizationId) ? (0, typeorm_1.IsNull)() : organizationId,
                tenantId: (0, utils_1.isEmpty)(tenantId) ? (0, typeorm_1.IsNull)() : tenantId
            });
            switch (type) {
                case 'subject':
                    entity = {
                        ...emailTemplate,
                        hbs: content.hbs
                    };
                    break;
                case 'html':
                    entity = {
                        ...emailTemplate,
                        mjml: content.mjml,
                        hbs: mjml2html(content.mjml).html
                    };
                    break;
            }
            await super.create({ id: emailTemplate.id, ...entity });
        }
        catch (error) {
            entity = new email_template_entity_1.EmailTemplate({
                organizationId,
                tenantId,
                languageCode
            });
            entity.name = `${name}/${type}`;
            switch (type) {
                case 'subject':
                    entity.hbs = content.hbs;
                    break;
                case 'html':
                    entity.mjml = content.mjml;
                    entity.hbs = mjml2html(content.mjml).html;
                    break;
            }
            await super.create(entity);
        }
        return entity;
    }
};
exports.EmailTemplateService = EmailTemplateService;
exports.EmailTemplateService = EmailTemplateService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_email_template_repository_1.TypeOrmEmailTemplateRepository,
        mikro_orm_email_template_repository_1.MikroOrmEmailTemplateRepository])
], EmailTemplateService);
//# sourceMappingURL=email-template.service.js.map