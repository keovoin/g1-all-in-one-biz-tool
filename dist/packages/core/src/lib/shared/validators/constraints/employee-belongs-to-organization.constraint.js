"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeBelongsToOrganizationConstraint = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../../../core/context");
const utils_2 = require("../../../core/utils");
const type_orm_employee_repository_1 = require("../../../employee/repository/type-orm-employee.repository");
const mikro_orm_employee_repository_1 = require("../../../employee/repository/mikro-orm-employee.repository");
// Get the type of the Object-Relational Mapping (ORM) used in the application.
const ormType = (0, utils_2.getORMType)();
/**
 * Validator constraint for employee belonging to organization validation.
 */
let EmployeeBelongsToOrganizationConstraint = class EmployeeBelongsToOrganizationConstraint {
    constructor(typeOrmEmployeeRepository, mikroOrmEmployeeRepository) {
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.mikroOrmEmployeeRepository = mikroOrmEmployeeRepository;
    }
    /**
     * Validates if the employee belongs to the organization.
     * @param value - The employee ID or employee object.
     * @param args - Validation arguments containing the object with organization details.
     * @returns {Promise<boolean>} - True if the employee belongs to the organization, otherwise false.
     */
    async validate(value, args) {
        if ((0, utils_1.isEmpty)(value))
            return true;
        const employeeId = typeof value === 'string' ? value : value?.id;
        // The UI ships an ALL_EMPLOYEES_SELECTED sentinel (`{ id: null, firstName: 'All Employees', ... }`)
        // whenever no concrete employee is picked, so `value` can be a NON-empty object carrying an EMPTY
        // id — the `isEmpty(value)` early-out above does not catch that shape. There is no employee to
        // validate in that case: the record is organization-level and `employeeId` is legitimately null.
        // Never issue the lookup with an empty id — `findOneByOrFail({ id: null, ... })` used to have its
        // `id` predicate silently dropped and matched the FIRST employee of the organization (the exact
        // widening GHSA-44pv-34gx-q9p4 closed); it now compiles to `id IS NULL`, finds nothing, and
        // rejects a perfectly legal org-level record with a 400.
        if ((0, utils_1.isEmpty)(employeeId)) {
            return true;
        }
        const object = args.object;
        const organizationId = object.organizationId || object.organization?.id;
        if (!organizationId)
            return true; // No organization ID provided
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            // Fetch the employee from the database using the provided employee ID and organization ID
            return !!(await this.findOneByOrFail(employeeId, organizationId, tenantId));
        }
        catch (error) {
            // Handle different types of errors if needed, for now assuming not found means false
            return false;
        }
    }
    /**
     * Fetches an employee entity based on the employee ID, organization ID, and tenant ID.
     * It uses the appropriate ORM repository to perform the find operation.
     *
     * @param employeeId - The ID of the employee.
     * @param organizationId - The ID of the organization the employee belongs to.
     * @param tenantId - The tenant ID.
     * @returns A Promise that resolves to the employee entity if found, or undefined.
     */
    async findOneByOrFail(employeeId, organizationId, tenantId) {
        // Create a where clause for the employee
        const whereClause = {
            id: employeeId,
            organizationId,
            tenantId
        };
        // Use the appropriate ORM repository based on the type of the application
        switch (ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return await this.mikroOrmEmployeeRepository.findOneOrFail(whereClause);
            case utils_2.MultiORMEnum.TypeORM:
                return await this.typeOrmEmployeeRepository.findOneByOrFail(whereClause);
            default:
                throw new Error(`Not implemented for ${ormType}`);
        }
    }
    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `This employee (${JSON.stringify(value)}) does not belong to the specified organization.`;
    }
};
exports.EmployeeBelongsToOrganizationConstraint = EmployeeBelongsToOrganizationConstraint;
exports.EmployeeBelongsToOrganizationConstraint = EmployeeBelongsToOrganizationConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsEmployeeBelongsToOrganization', async: true }),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository])
], EmployeeBelongsToOrganizationConstraint);
//# sourceMappingURL=employee-belongs-to-organization.constraint.js.map