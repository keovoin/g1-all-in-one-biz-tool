"use strict";
var DocsSeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsSeederService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const document_entity_1 = require("../entities/document.entity");
const document_category_entity_1 = require("../entities/document-category.entity");
const default_categories_1 = require("./default-categories");
const initial_content_1 = require("./initial-content");
/**
 * Seeds the Documents plugin defaults through the plugin lifecycle
 * (`DocsPlugin implements IOnPluginSeedable`), per tenant + organization, **idempotently**
 * (every step probes before inserting). Seeds never enqueue processing jobs and never call
 * AI providers.
 */
let DocsSeederService = DocsSeederService_1 = class DocsSeederService {
    constructor(seeder) {
        this.seeder = seeder;
        this.logger = new common_1.Logger(DocsSeederService_1.name);
    }
    /**
     * Reserved — no-op in v1 (invoked by `onPluginBasicSeed`).
     */
    async seedBasic() {
        // Reserved for future basic-seed content
    }
    /**
     * Default seed: the 11 system categories per organization (probe by slug — user renames
     * survive) + the starter "Company Library" folder and welcome page (only into an organization
     * with zero `document` rows).
     */
    async seedDefault() {
        const { dataSource, tenant } = this.seeder;
        const organizations = await (0, core_1.getDefaultOrganizations)(dataSource, tenant);
        for (const organization of organizations ?? []) {
            await this.seedOrganization(dataSource, tenant, organization);
        }
    }
    /**
     * Random (demo) seed: per organization, 2 demo folders holding a few FILE rows with
     * plausible metadata + 2 lorem PAGE documents — enough for every filter chip to have data.
     * No real blobs are written; demo FILE rows are flagged `metadata.demo: true`.
     */
    async seedRandom() {
        const { dataSource, tenant } = this.seeder;
        const organizations = await (0, core_1.getDefaultOrganizations)(dataSource, tenant);
        for (const organization of organizations ?? []) {
            await this.seedDemoDocuments(dataSource, tenant, organization);
        }
    }
    /**
     * Seeds one organization: categories, then starter content.
     */
    async seedOrganization(dataSource, tenant, organization) {
        const categoryRepository = dataSource.getRepository(document_category_entity_1.DocumentCategory);
        const documentRepository = dataSource.getRepository(document_entity_1.Document);
        // 1) System categories — skip any slug that already exists in the org (safe re-seed)
        for (const definition of default_categories_1.DEFAULT_DOCUMENT_CATEGORIES) {
            const exists = await categoryRepository.findOne({
                where: { tenantId: tenant.id, organizationId: organization.id, slug: definition.slug },
                withDeleted: true
            });
            if (!exists) {
                await categoryRepository.save(categoryRepository.create({
                    tenantId: tenant.id,
                    organizationId: organization.id,
                    name: definition.name,
                    slug: definition.slug,
                    color: definition.color,
                    icon: definition.icon,
                    isSystem: true
                }));
            }
        }
        // 2) Starter content — only when the organization has zero document rows
        const documentCount = await documentRepository.count({
            where: { tenantId: tenant.id, organizationId: organization.id },
            withDeleted: true
        });
        if (documentCount > 0) {
            return; // Idempotency guard — re-runs are no-ops
        }
        const folder = await documentRepository.save(documentRepository.create({
            tenantId: tenant.id,
            organizationId: organization.id,
            kind: contracts_1.DocumentKindEnum.FOLDER,
            name: initial_content_1.STARTER_FOLDER.name,
            icon: initial_content_1.STARTER_FOLDER.icon,
            index: 0,
            status: contracts_1.DocumentStatusEnum.READY,
            source: contracts_1.DocumentSourceEnum.SYSTEM,
            visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION,
            knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.NONE
        }));
        await documentRepository.save(documentRepository.create({
            tenantId: tenant.id,
            organizationId: organization.id,
            kind: contracts_1.DocumentKindEnum.PAGE,
            parentId: folder.id,
            name: initial_content_1.STARTER_PAGE_NAME,
            icon: initial_content_1.STARTER_PAGE_ICON,
            index: 0,
            contentJson: this.serializeJson(initial_content_1.STARTER_PAGE_CONTENT_JSON),
            contentHtml: initial_content_1.STARTER_PAGE_CONTENT_HTML,
            status: contracts_1.DocumentStatusEnum.READY,
            source: contracts_1.DocumentSourceEnum.SYSTEM,
            visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION,
            knowledgeStatus: contracts_1.DocumentKnowledgeStatusEnum.NONE,
            searchable: true
        }));
        this.logger.log(`Seeded Documents starter content for organization ${organization.id}`);
    }
    /**
     * Seeds lightweight demo documents for one organization (random seed phase).
     */
    async seedDemoDocuments(dataSource, tenant, organization) {
        const documentRepository = dataSource.getRepository(document_entity_1.Document);
        const demoMimeTypes = ['application/pdf', 'text/csv', 'image/png'];
        for (let folderIndex = 0; folderIndex < 2; folderIndex++) {
            const folder = await documentRepository.save(documentRepository.create({
                tenantId: tenant.id,
                organizationId: organization.id,
                kind: contracts_1.DocumentKindEnum.FOLDER,
                name: `Demo Folder ${folderIndex + 1}`,
                index: folderIndex + 1,
                status: contracts_1.DocumentStatusEnum.READY,
                source: contracts_1.DocumentSourceEnum.SYSTEM,
                visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION
            }));
            // How many demo files this folder gets. Cosmetic variety in seed data only — never a
            // secret or an access decision — but drawn from the CSPRNG so rule S2245 does not
            // have to be re-litigated at every future reader.
            const fileCount = (0, crypto_1.randomInt)(3, 7); // 3–6 files
            for (let fileIndex = 0; fileIndex < fileCount; fileIndex++) {
                await documentRepository.save(documentRepository.create({
                    tenantId: tenant.id,
                    organizationId: organization.id,
                    kind: contracts_1.DocumentKindEnum.FILE,
                    parentId: folder.id,
                    name: `Demo Document ${folderIndex + 1}-${fileIndex + 1}`,
                    index: fileIndex,
                    mimeType: demoMimeTypes[fileIndex % demoMimeTypes.length],
                    fileSize: 1024 * (fileIndex + 1),
                    originalFilename: `demo-${folderIndex + 1}-${fileIndex + 1}.pdf`,
                    extractedText: 'Demo extracted text used to exercise the search facets.',
                    status: contracts_1.DocumentStatusEnum.READY,
                    source: contracts_1.DocumentSourceEnum.UPLOAD,
                    visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION,
                    knowledgeStatus: fileIndex % 2 === 0 ? contracts_1.DocumentKnowledgeStatusEnum.INDEXED : contracts_1.DocumentKnowledgeStatusEnum.NONE,
                    metadata: this.serializeJson({ demo: true })
                }));
            }
        }
        for (let pageIndex = 0; pageIndex < 2; pageIndex++) {
            await documentRepository.save(documentRepository.create({
                tenantId: tenant.id,
                organizationId: organization.id,
                kind: contracts_1.DocumentKindEnum.PAGE,
                name: `Demo Page ${pageIndex + 1}`,
                index: 10 + pageIndex,
                contentJson: this.serializeJson({
                    type: 'doc',
                    content: [
                        {
                            type: 'paragraph',
                            content: [{ type: 'text', text: 'Lorem ipsum demo page content.' }]
                        }
                    ]
                }),
                contentHtml: '<p>Lorem ipsum demo page content.</p>',
                status: contracts_1.DocumentStatusEnum.READY,
                source: contracts_1.DocumentSourceEnum.EDITOR,
                visibility: contracts_1.DocumentVisibilityEnum.ORGANIZATION
            }));
        }
        this.logger.log(`Seeded Documents demo content for organization ${organization.id}`);
    }
    /**
     * Serializes JSON columns for the SQLite path (seed writes may bypass the subscriber's
     * per-connection registration order, so serialization is applied defensively here).
     */
    serializeJson(value) {
        return (0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)() ? JSON.stringify(value) : value;
    }
};
exports.DocsSeederService = DocsSeederService;
exports.DocsSeederService = DocsSeederService = DocsSeederService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.SeedDataService])
], DocsSeederService);
//# sourceMappingURL=docs-seeder.service.js.map