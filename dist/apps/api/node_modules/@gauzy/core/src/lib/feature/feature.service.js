"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const crud_service_1 = require("../core/crud/crud.service");
const type_orm_feature_repository_1 = require("./repository/type-orm-feature.repository");
const mikro_orm_feature_repository_1 = require("./repository/mikro-orm-feature.repository");
let FeatureService = class FeatureService extends crud_service_1.CrudService {
    constructor(typeOrmFeatureRepository, mikroOrmFeatureRepository) {
        super(typeOrmFeatureRepository, mikroOrmFeatureRepository);
        this.typeOrmFeatureRepository = typeOrmFeatureRepository;
        this.mikroOrmFeatureRepository = mikroOrmFeatureRepository;
    }
    /**
     * Retrieves top-level features (those with no parent) from the database. Allows specifying related entities
     * to be included in the result. Features are ordered by their creation time in ascending order.
     *
     * @param relations An array of strings indicating which related entities to include in the result.
     * @returns A promise resolving to a paginated response containing top-level IFeature objects.
     */
    async getParentFeatures(relations = []) {
        return await super.findAll({
            where: {
                parentId: (0, typeorm_1.IsNull)()
            },
            relations,
            order: {
                createdAt: 'ASC'
            }
        });
    }
    /**
     * Checks if the specified feature flag is enabled.
     * @param flag The feature flag to check.
     * @returns A boolean indicating whether the feature flag is enabled.
     */
    async isFeatureEnabled(flag) {
        try {
            const featureFlag = await super.findOneByWhereOptions({ code: flag });
            return featureFlag.isEnabled;
        }
        catch (error) {
            // Feature flag not found, fallback to default value
            return !!config_1.gauzyToggleFeatures[flag];
        }
    }
};
exports.FeatureService = FeatureService;
exports.FeatureService = FeatureService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_feature_repository_1.TypeOrmFeatureRepository,
        mikro_orm_feature_repository_1.MikroOrmFeatureRepository])
], FeatureService);
//# sourceMappingURL=feature.service.js.map