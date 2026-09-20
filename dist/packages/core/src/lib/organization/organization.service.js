"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const html_sanitizer_1 = require("./../core/html-sanitizer");
const type_orm_organization_repository_1 = require("./repository/type-orm-organization.repository");
const mikro_orm_organization_repository_1 = require("./repository/mikro-orm-organization.repository");
let OrganizationService = class OrganizationService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationRepository, mikroOrmOrganizationRepository) {
        super(typeOrmOrganizationRepository, mikroOrmOrganizationRepository);
        this.typeOrmOrganizationRepository = typeOrmOrganizationRepository;
        this.mikroOrmOrganizationRepository = mikroOrmOrganizationRepository;
    }
    /**
     * Creates (or, via the organization update command handler, upserts) an organization,
     * sanitizing the rich-text `overview` HTML through the shared server-side allowlist before
     * persisting. `Organization.overview` is rendered with raw `[innerHTML]` on the PUBLIC
     * organization page, so every write path must be sanitized (see `sanitizeRichHtml`).
     *
     * @param entity - The organization data to persist.
     * @returns The persisted organization.
     */
    async create(entity) {
        const input = entity;
        if (typeof input.overview === 'string') {
            input.overview = (0, html_sanitizer_1.sanitizeRichHtml)(input.overview);
        }
        return await super.create(entity);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_repository_1.TypeOrmOrganizationRepository,
        mikro_orm_organization_repository_1.MikroOrmOrganizationRepository])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map