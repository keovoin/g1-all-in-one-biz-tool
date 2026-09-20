"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicOrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const utils_1 = require("../../core/utils");
const public_html_sanitizer_1 = require("../public-html-sanitizer");
/**
 * Display-safe field allowlist for the public organization profile.
 *
 * The public endpoint must NOT return the entire Organization entity (taxId, officialName, internal
 * flags, tenantId, etc.). Only the fields the public profile page renders are exposed
 * (GHSA-49ff-8859-537j). Relations requested by the caller load in full (they are not restricted
 * here); only the organization's own columns are projected.
 */
const PUBLIC_ORGANIZATION_SELECT = {
    id: true,
    name: true,
    profile_link: true,
    imageUrl: true,
    banner: true,
    short_description: true,
    overview: true,
    currency: true,
    currencyPosition: true,
    registrationDate: true,
    minimumProjectSize: true,
    client_focus: true,
    regionCode: true,
    dateFormat: true,
    defaultValueDateType: true,
    show_income: true,
    show_profits: true,
    show_bonuses_paid: true,
    show_clients: true,
    show_clients_count: true,
    show_employees_count: true,
    show_projects_count: true,
    show_minimum_project_size: true
};
/** Same allowlist as a flat field list for the MikroORM `fields` option. */
const PUBLIC_ORGANIZATION_FIELDS = Object.keys(PUBLIC_ORGANIZATION_SELECT);
/**
 * Applies the organization's `show_*` visibility flags server-side. `minimumProjectSize` is removed
 * from the response unless `show_minimum_project_size` is enabled, so it is never readable when the
 * public profile intends to hide it (GHSA-49ff-8859-537j).
 *
 * @param organization - The loaded (already field-projected) organization.
 * @returns The same organization with hidden fields stripped.
 */
function applyOrganizationVisibility(organization) {
    if (!organization) {
        return organization;
    }
    const o = organization;
    if (!o['show_minimum_project_size']) {
        delete o['minimumProjectSize'];
    }
    return organization;
}
/**
 * Sanitizes the rich-text HTML this endpoint serves, on the way OUT — see
 * `sanitizePublicRichTextFields` for why the write-path pass is not enough on an unauthenticated
 * endpoint. Idempotent, so a row already clean round-trips byte-for-byte.
 *
 * @param organization - The loaded (already field-projected and visibility-filtered) organization.
 * @returns The same organization with its HTML fields sanitized.
 */
function sanitizeOrganizationHtml(organization) {
    return (0, public_html_sanitizer_1.sanitizePublicRichTextFields)(organization, public_html_sanitizer_1.PUBLIC_ORGANIZATION_HTML_FIELDS);
}
const type_orm_organization_repository_1 = require("../../organization/repository/type-orm-organization.repository");
const mikro_orm_organization_repository_1 = require("../../organization/repository/mikro-orm-organization.repository");
const type_orm_organization_contact_repository_1 = require("../../organization-contact/repository/type-orm-organization-contact.repository");
const mikro_orm_organization_contact_repository_1 = require("../../organization-contact/repository/mikro-orm-organization-contact.repository");
const type_orm_organization_project_repository_1 = require("../../organization-project/repository/type-orm-organization-project.repository");
const mikro_orm_organization_project_repository_1 = require("../../organization-project/repository/mikro-orm-organization-project.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_1.getORMType)();
let PublicOrganizationService = class PublicOrganizationService {
    constructor(typeOrmOrganizationRepository, mikroOrmOrganizationRepository, typeOrmOrganizationContactRepository, mikroOrmOrganizationContactRepository, typeOrmOrganizationProjectRepository, mikroOrmOrganizationProjectRepository) {
        this.typeOrmOrganizationRepository = typeOrmOrganizationRepository;
        this.mikroOrmOrganizationRepository = mikroOrmOrganizationRepository;
        this.typeOrmOrganizationContactRepository = typeOrmOrganizationContactRepository;
        this.mikroOrmOrganizationContactRepository = mikroOrmOrganizationContactRepository;
        this.typeOrmOrganizationProjectRepository = typeOrmOrganizationProjectRepository;
        this.mikroOrmOrganizationProjectRepository = mikroOrmOrganizationProjectRepository;
    }
    /**
     * GET organization by profile link
     *
     * @param options
     * @param relations
     * @returns
     */
    async findOneByProfileLink(where, relations) {
        try {
            let organization;
            switch (ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    organization = await this.mikroOrmOrganizationRepository.findOneOrFail(where, {
                        populate: relations,
                        // Restrict the response to display-safe fields only (GHSA-49ff-8859-537j).
                        // Requested relations are included so they still load in full.
                        fields: [
                            ...PUBLIC_ORGANIZATION_FIELDS,
                            ...(Array.isArray(relations) ? relations : [])
                        ]
                    });
                    break;
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    organization = await this.typeOrmOrganizationRepository.findOneOrFail({
                        where,
                        relations: (0, utils_1.parseFindOptionsRelations)(relations),
                        // Restrict the response to display-safe fields only (GHSA-49ff-8859-537j).
                        select: PUBLIC_ORGANIZATION_SELECT
                    });
                    break;
            }
            // Enforce the organization's own visibility flags server-side, then neutralize the
            // rich-text HTML this response carries onto an unauthenticated page.
            return sanitizeOrganizationHtml(applyOrganizationVisibility(organization));
        }
        catch (error) {
            throw new common_1.NotFoundException(`The requested record was not found`);
        }
    }
    /**
     * GET all public clients by organization condition
     *
     * @param options
     * @returns
     */
    async findPublicClientsByOrganization(options) {
        try {
            switch (ormType) {
                case utils_1.MultiORMEnum.MikroORM: {
                    const [items = [], total = 0] = await this.mikroOrmOrganizationContactRepository.findAndCount(options);
                    return { items, total };
                }
                case utils_1.MultiORMEnum.TypeORM:
                default: {
                    const [items = [], total = 0] = await this.typeOrmOrganizationContactRepository.findAndCountBy(options);
                    return { items, total };
                }
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`The requested public clients was not found`);
        }
    }
    /**
     * GET all public client counts by organization condition
     *
     * @param options
     * @returns
     */
    async findPublicClientCountsByOrganization(options) {
        try {
            switch (ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    return await this.mikroOrmOrganizationContactRepository.count(options);
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    return await this.typeOrmOrganizationContactRepository.countBy(options);
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`The requested client counts was not found`);
        }
    }
    /**
     * GET all public project counts by organization condition
     *
     * @param options
     * @returns
     */
    async findPublicProjectCountsByOrganization(options) {
        try {
            switch (ormType) {
                case utils_1.MultiORMEnum.MikroORM:
                    return await this.mikroOrmOrganizationProjectRepository.count(options);
                case utils_1.MultiORMEnum.TypeORM:
                default:
                    return await this.typeOrmOrganizationProjectRepository.countBy(options);
            }
        }
        catch (error) {
            throw new common_1.NotFoundException(`The requested project counts was not found`);
        }
    }
};
exports.PublicOrganizationService = PublicOrganizationService;
exports.PublicOrganizationService = PublicOrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_repository_1.TypeOrmOrganizationRepository,
        mikro_orm_organization_repository_1.MikroOrmOrganizationRepository,
        type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository,
        mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository,
        type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
        mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository])
], PublicOrganizationService);
//# sourceMappingURL=public-organization.service.js.map