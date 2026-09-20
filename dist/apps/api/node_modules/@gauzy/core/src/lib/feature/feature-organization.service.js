"use strict";
var FeatureOrganizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureOrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const feature_organization_entity_1 = require("./feature-organization.entity");
const feature_service_1 = require("./feature.service");
const type_orm_feature_organization_repository_1 = require("./repository/type-orm-feature-organization.repository");
const mikro_orm_feature_organization_repository_1 = require("./repository/mikro-orm-feature-organization.repository");
let FeatureOrganizationService = FeatureOrganizationService_1 = class FeatureOrganizationService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmFeatureOrganizationRepository, mikroOrmFeatureOrganizationRepository, _featureService) {
        super(typeOrmFeatureOrganizationRepository, mikroOrmFeatureOrganizationRepository);
        this.typeOrmFeatureOrganizationRepository = typeOrmFeatureOrganizationRepository;
        this.mikroOrmFeatureOrganizationRepository = mikroOrmFeatureOrganizationRepository;
        this._featureService = _featureService;
        this.logger = new common_1.Logger(FeatureOrganizationService_1.name);
    }
    /**
     * UPDATE feature organization respective tenant by feature id
     *
     * @param input
     * @returns
     */
    async updateFeatureOrganization(entity) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const { featureId, organizationId } = entity;
        // find all feature organization by feature id
        const { items: featureOrganizations, total } = await this.findAll({
            where: {
                tenantId,
                featureId,
                ...((0, utils_1.isNotEmpty)(organizationId) ? { organizationId } : {})
            }
        });
        try {
            if (!total) {
                const featureOrganization = new feature_organization_entity_1.FeatureOrganization({
                    ...entity,
                    tenantId
                });
                await this.save(featureOrganization);
            }
            else {
                featureOrganizations.map((item) => {
                    return new feature_organization_entity_1.FeatureOrganization(Object.assign(item, {
                        ...entity,
                        tenantId
                    }));
                });
                await this.saveMany(featureOrganizations);
            }
            return true;
        }
        catch (error) {
            this.logger.error('Error while updating feature organization', error?.message);
            return false;
        }
    }
    /**
     * Create/Update feature organization for relative tenants.
     *
     * @param tenants An array of ITenant instances.
     * @returns A Promise resolving to an array of IFeatureOrganization.
     */
    async updateTenantFeatureOrganizations(tenants) {
        if (!tenants || tenants.length === 0) {
            return [];
        }
        // Retrieve all available features
        const features = await this._featureService.find();
        // Generate a cartesian product of features and tenants to create FeatureOrganization entities
        const featureOrganizations = features.flatMap((feature) => tenants.map((tenant) => new feature_organization_entity_1.FeatureOrganization({
            isEnabled: !!feature.isEnabled,
            tenant,
            feature
        })));
        /**
         * Use saveManyWithoutEnrichment to avoid TenantAwareCrudService.saveMany()
         * which would overwrite per-entity tenantId with the current RequestContext tenantId.
         */
        return await this.saveManyWithoutEnrichment(featureOrganizations);
    }
};
exports.FeatureOrganizationService = FeatureOrganizationService;
exports.FeatureOrganizationService = FeatureOrganizationService = FeatureOrganizationService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => feature_service_1.FeatureService))),
    tslib_1.__metadata("design:paramtypes", [type_orm_feature_organization_repository_1.TypeOrmFeatureOrganizationRepository,
        mikro_orm_feature_organization_repository_1.MikroOrmFeatureOrganizationRepository,
        feature_service_1.FeatureService])
], FeatureOrganizationService);
//# sourceMappingURL=feature-organization.service.js.map