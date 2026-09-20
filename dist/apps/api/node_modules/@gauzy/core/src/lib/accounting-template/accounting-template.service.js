"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingTemplateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const mjml2html = require("mjml");
const Handlebars = require("handlebars");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const accounting_template_entity_1 = require("./accounting-template.entity");
const accounting_template_criteria_1 = require("./accounting-template.criteria");
const crud_1 = require("./../core/crud");
const utils_2 = require("./../core/utils");
const context_1 = require("./../core/context");
const database_helper_1 = require("./../database/database.helper");
const type_orm_accounting_template_repository_1 = require("./repository/type-orm-accounting-template.repository");
const mikro_orm_accounting_template_repository_1 = require("./repository/mikro-orm-accounting-template.repository");
let AccountingTemplateService = class AccountingTemplateService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmAccountingTemplateRepository, mikroOrmAccountingTemplateRepository) {
        super(typeOrmAccountingTemplateRepository, mikroOrmAccountingTemplateRepository);
    }
    generatePreview(input) {
        const { data, organization } = input.request;
        let textToHtml = data;
        try {
            const mjmlToHtml = mjml2html(data);
            textToHtml = mjmlToHtml.errors.length ? data : mjmlToHtml.html;
        }
        catch (error) { }
        const handlebarsTemplate = Handlebars.compile(textToHtml);
        Handlebars.registerHelper('if_eq', function (a, b, opts) {
            if (a == b) {
                return opts.fn(this);
            }
            else {
                return opts.inverse(this);
            }
        });
        const html = handlebarsTemplate({
            invoiceNumber: '1',
            from: organization,
            to: 'Sample Client',
            invoiceDate: '2021-02-23',
            dueDate: '2021-03-23',
            currency: 'BGN',
            tax: '20',
            tax2: '0',
            discountValue: '0',
            totalValue: '168',
            taxType: 'PERCENT',
            tax2Type: 'FLAT',
            discountType: 'PERCENT',
            hasRemainingAmountInvoiced: true,
            alreadyPaid: '0',
            amountDue: '168',
            invoiceItems: [
                {
                    name: 'Item 1',
                    description: 'Desc 1',
                    quantity: '1',
                    price: '10',
                    totalValue: '10'
                },
                {
                    name: 'Item 2',
                    description: 'Desc 2',
                    quantity: '2',
                    price: '20',
                    totalValue: '40'
                },
                {
                    name: 'Item 3',
                    description: 'Desc 3',
                    quantity: '3',
                    price: '30',
                    totalValue: '90'
                }
            ],
            estimateNumber: '1',
            estimateDate: '2021-02-23',
            estimateDueDate: '2021-03-23',
            estimateItems: [
                {
                    name: 'Item 1',
                    description: 'Desc 1',
                    quantity: '1',
                    price: '10',
                    totalValue: '10'
                },
                {
                    name: 'Item 2',
                    description: 'Desc 2',
                    quantity: '2',
                    price: '20',
                    totalValue: '40'
                },
                {
                    name: 'Item 3',
                    description: 'Desc 3',
                    quantity: '3',
                    price: '30',
                    totalValue: '90'
                }
            ],
            imgPath: 'assets/images/logos/ever-large.jpg',
            receiptNumber: '1',
            paymentDate: '2021-02-24',
            paymentMethod: 'Bank Transfer',
            receiptItems: [
                {
                    name: 'Item 1',
                    description: 'Desc 1',
                    quantity: '1',
                    price: '10',
                    totalValue: '10'
                },
                {
                    name: 'Item 2',
                    description: 'Desc 2',
                    quantity: '2',
                    price: '20',
                    totalValue: '40'
                },
                {
                    name: 'Item 3',
                    description: 'Desc 3',
                    quantity: '3',
                    price: '30',
                    totalValue: '90'
                }
            ],
            subtotal: '140',
            totalPaid: '168'
        });
        return { html };
    }
    /**
     * Save accounting template to the organization
     *
     * @param input
     * @returns
     */
    async saveTemplate(input) {
        const tenantId = context_1.RequestContext.currentTenantId();
        try {
            const record = await this.findOneByWhereOptions({
                languageCode: input.languageCode,
                templateType: input.templateType,
                organizationId: input.organizationId,
                tenantId
            });
            let entity = {
                ...record,
                hbs: mjml2html(record.mjml).html,
                mjml: input.mjml
            };
            return await this.update(record.id, entity);
        }
        catch (error) {
            const entity = new accounting_template_entity_1.AccountingTemplate();
            entity.languageCode = input.languageCode;
            entity.templateType = input.templateType;
            entity.name = input.templateType;
            entity.mjml = input.mjml;
            entity.hbs = mjml2html(input.mjml).html;
            entity.organizationId = input.organizationId;
            entity.tenantId = tenantId;
            return await this.create(entity);
        }
    }
    /**
     * GET single accounting template by conditions
     *
     * @param options
     * @param themeLanguage
     * @returns
     */
    async getAccountTemplate(options, themeLanguage) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const { templateType = contracts_1.AccountingTemplateTypeEnum.INVOICE, organizationId, languageCode = themeLanguage } = options;
        // Try each fallback in order:
        //   requested language, this tenant  ->  requested language, GLOBAL
        //   English, this tenant             ->  English, GLOBAL
        // A "global" template is the seeded row with tenantId IS NULL AND organizationId IS NULL. It is
        // looked up with explicit NULL criteria on the raw repository (bypassing TenantAwareCrudService,
        // which would pin the caller's tenant) — never with a literal `null`, which TypeORM used to drop
        // from the SQL and thereby match another tenant's template (GHSA-44pv-34gx-q9p4).
        const fallbacks = [
            { languageCode, global: false },
            { languageCode, global: true },
            { languageCode: contracts_1.LanguagesEnum.ENGLISH, global: false },
            { languageCode: contracts_1.LanguagesEnum.ENGLISH, global: true }
        ];
        for (const fallback of fallbacks) {
            try {
                let record;
                if (fallback.global) {
                    record = await this.findGlobalTemplate({ languageCode: fallback.languageCode, templateType });
                }
                else {
                    record = await this.findOneByWhereOptions((0, accounting_template_criteria_1.tenantAccountingTemplateWhere)({
                        languageCode: fallback.languageCode,
                        templateType,
                        tenantId,
                        organizationId
                    }));
                }
                if (record)
                    return record;
            }
            catch (error) {
                // continue to next fallback
            }
        }
        return null;
    }
    /**
     * Finds the GLOBAL (tenant-less, organization-less) template for a language/type pair.
     *
     * Runs on the raw repositories on purpose: TenantAwareCrudService would scope the lookup to the
     * caller's tenant, and the global row has no tenant. Both ORM branches pin `tenantId` AND
     * `organizationId` to `IS NULL` — see accounting-template.criteria.ts.
     *
     * @param lookup - The language code and template type to look up.
     * @returns The global template, or null when none is seeded for that pair.
     */
    async findGlobalTemplate(lookup) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const record = await this.mikroOrmRepository.findOne((0, accounting_template_criteria_1.globalAccountingTemplateMikroWhere)(lookup));
                return record ? this.serialize(record) : null;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmRepository.findOneBy((0, accounting_template_criteria_1.globalAccountingTemplateWhere)(lookup));
        }
    }
    /**
     * Get Accounting Templates using pagination params
     *
     * @param params
     * @returns
     */
    async findAll(params) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(params);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                const { organizationId: mOrgId, languageCode: mLangCode } = params.where;
                const mTenantId = context_1.RequestContext.currentTenantId();
                // Build OR conditions for MikroORM
                const mWhere = {
                    $or: [
                        {
                            ...((0, utils_1.isNotEmpty)(mOrgId) ? { organizationId: mOrgId } : {}),
                            ...((0, utils_1.isNotEmpty)(mLangCode) ? { languageCode: mLangCode } : {}),
                            tenantId: mTenantId
                        },
                        {
                            ...((0, utils_1.isNotEmpty)(mLangCode) ? { languageCode: mLangCode } : {}),
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
                const query = this.typeOrmRepository.createQueryBuilder('accounting_template');
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
                    qb.andWhere(new typeorm_1.Brackets((bck) => {
                        const { organizationId, languageCode } = params.where;
                        if ((0, utils_1.isNotEmpty)(organizationId)) {
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" = :organizationId`), {
                                organizationId
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(languageCode)) {
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."languageCode" = :languageCode`), {
                                languageCode
                            });
                        }
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), {
                            tenantId: context_1.RequestContext.currentTenantId()
                        });
                    }));
                    qb.orWhere(new typeorm_1.Brackets((bck) => {
                        const { languageCode } = params.where;
                        if ((0, utils_1.isNotEmpty)(languageCode)) {
                            bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."languageCode" = :languageCode`), { languageCode });
                        }
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."organizationId" IS NULL`));
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" IS NULL`));
                    }));
                });
                const [items, total] = await query.getManyAndCount();
                return { items, total };
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
    /**
     * Finds a single accounting template by its ID while considering tenant
     * and organization scope. If no specific tenant or organization is set,
     * it retrieves global templates.
     *
     * @param id - The ID of the accounting template to retrieve.
     * @returns The matching accounting template or null if not found.
     */
    async findOneByIdString(id) {
        const tenantId = context_1.RequestContext.currentTenantId();
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                const mRecord = await this.mikroOrmRepository.findOne({
                    $or: [
                        { id, tenantId },
                        { id, tenantId: null }
                    ]
                });
                if (!mRecord) {
                    throw new common_1.NotFoundException(`The requested record was not found`);
                }
                return this.serialize(mRecord);
            case utils_2.MultiORMEnum.TypeORM:
                const query = this.typeOrmRepository.createQueryBuilder('template');
                query.where((qb) => {
                    qb.andWhere(new typeorm_1.Brackets((bck) => {
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."id" = :id`), { id });
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    qb.orWhere(new typeorm_1.Brackets((bck) => {
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."id" = :id`), { id });
                        bck.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" IS NULL`));
                    }));
                });
                return await query.getOne();
            default:
                throw new Error(`Not implemented for ${this.ormType}`);
        }
    }
};
exports.AccountingTemplateService = AccountingTemplateService;
exports.AccountingTemplateService = AccountingTemplateService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_accounting_template_repository_1.TypeOrmAccountingTemplateRepository,
        mikro_orm_accounting_template_repository_1.MikroOrmAccountingTemplateRepository])
], AccountingTemplateService);
//# sourceMappingURL=accounting-template.service.js.map