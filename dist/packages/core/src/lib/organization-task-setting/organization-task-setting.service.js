"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTaskSettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const context_1 = require("./../core/context");
const crud_1 = require("../core/crud");
const type_orm_organization_task_setting_repository_1 = require("./repository/type-orm-organization-task-setting.repository");
const mikro_orm_organization_task_setting_repository_1 = require("./repository/mikro-orm-organization-task-setting.repository");
let OrganizationTaskSettingService = class OrganizationTaskSettingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationTaskSettingRepository, mikroOrmOrganizationTaskSettingRepository) {
        super(typeOrmOrganizationTaskSettingRepository, mikroOrmOrganizationTaskSettingRepository);
        this.typeOrmOrganizationTaskSettingRepository = typeOrmOrganizationTaskSettingRepository;
        this.mikroOrmOrganizationTaskSettingRepository = mikroOrmOrganizationTaskSettingRepository;
    }
    /**
     * Find organization task setting.
     *
     * @param options - The options to filter the organization task setting.
     * @returns A Promise resolving to the found organization task setting.
     */
    async findByOrganization(options) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const { organizationId } = options;
            const whereConditions = {
                organizationId,
                tenantId,
                isActive: true,
                isArchived: false
            };
            return await this.findOneByOptions({ where: whereConditions });
        }
        catch (error) {
            // Handle errors during the retrieving operation.
            console.error('Error during organization task settings retrieval:', error.message);
        }
    }
};
exports.OrganizationTaskSettingService = OrganizationTaskSettingService;
exports.OrganizationTaskSettingService = OrganizationTaskSettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_task_setting_repository_1.TypeOrmOrganizationTaskSettingRepository,
        mikro_orm_organization_task_setting_repository_1.MikroOrmOrganizationTaskSettingRepository])
], OrganizationTaskSettingService);
//# sourceMappingURL=organization-task-setting.service.js.map