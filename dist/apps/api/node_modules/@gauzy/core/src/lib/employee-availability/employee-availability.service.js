"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAvailabilityService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const request_context_1 = require("../core/context/request-context");
const tenant_aware_crud_service_1 = require("./../core/crud/tenant-aware-crud.service");
const type_orm_employee_availability_repository_1 = require("./repository/type-orm-employee-availability.repository");
const mikro_orm_employee_availability_repository_1 = require("./repository/mikro-orm-employee-availability.repository");
const employee_availability_entity_1 = require("./employee-availability.entity");
let EmployeeAvailabilityService = class EmployeeAvailabilityService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeAvailabilityRepository, mikroOrmEmployeeAvailabilityRepository) {
        super(typeOrmEmployeeAvailabilityRepository, mikroOrmEmployeeAvailabilityRepository);
        this.typeOrmEmployeeAvailabilityRepository = typeOrmEmployeeAvailabilityRepository;
        this.mikroOrmEmployeeAvailabilityRepository = mikroOrmEmployeeAvailabilityRepository;
    }
    /**
     * Bulk creates new employee availability records while ensuring each entity has `tenantId`.
     * Supports both TypeORM & MikroORM.
     *
     * @param entities List of employee availability objects to create.
     * @returns Promise<IEmployeeAvailability[]> List of created employee availability records.
     */
    async bulkCreate(entities) {
        const tenantId = request_context_1.RequestContext.currentTenantId();
        // Prepare entities ensuring `tenantId` is assigned
        const items = entities.map((entity) => new employee_availability_entity_1.EmployeeAvailability({
            ...entity,
            tenantId
        }));
        try {
            // Use base class createMany which handles both ORMs and tenant scoping
            return await this.createMany(items);
        }
        catch (error) {
            throw new common_1.HttpException(`Error in bulkCreate method of employee availability: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EmployeeAvailabilityService = EmployeeAvailabilityService;
exports.EmployeeAvailabilityService = EmployeeAvailabilityService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_availability_repository_1.TypeOrmEmployeeAvailabilityRepository,
        mikro_orm_employee_availability_repository_1.MikroOrmEmployeeAvailabilityRepository])
], EmployeeAvailabilityService);
//# sourceMappingURL=employee-availability.service.js.map