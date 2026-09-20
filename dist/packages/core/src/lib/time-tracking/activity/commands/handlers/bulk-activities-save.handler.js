"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkActivitiesSaveHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const activity_entity_1 = require("../../activity.entity");
const bulk_activities_save_command_1 = require("../bulk-activities-save.command");
const context_1 = require("../../../../core/context");
const type_orm_activity_repository_1 = require("../../repository/type-orm-activity.repository");
const type_orm_employee_repository_1 = require("../../../../employee/repository/type-orm-employee.repository");
let BulkActivitiesSaveHandler = class BulkActivitiesSaveHandler {
    constructor(typeOrmActivityRepository, typeOrmEmployeeRepository) {
        this.typeOrmActivityRepository = typeOrmActivityRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
    }
    /**
     * Executes the bulk save operation for activities.
     *
     * @param command - The command containing the input data for saving multiple activities.
     * @returns A promise that resolves with the saved activities.
     * @throws BadRequestException if there is an error during the save process.
     */
    async execute(command) {
        const { input } = command;
        let { employeeId, organizationId, activities = [], projectId } = input;
        const user = context_1.RequestContext.currentUser();
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        // Check if the logged user has permission to change the selected employee
        const hasChangeEmployeePermission = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        // Assign current employeeId if the user doesn't have permission or if employeeId is not provided
        if (!hasChangeEmployeePermission || ((0, utils_1.isEmpty)(employeeId) && context_1.RequestContext.currentEmployeeId())) {
            employeeId = context_1.RequestContext.currentEmployeeId();
        }
        // Assign the current user's organizationId if it's not provided
        if ((0, utils_1.isEmpty)(organizationId) && employeeId) {
            const employee = await this.typeOrmEmployeeRepository.findOneBy({ id: employeeId });
            organizationId = employee ? employee.organizationId : null;
        }
        // Log empty activities and filter out any invalid ones
        console.log(`Empty bulk App & URL's activities for employee (${user.name}): ${employeeId}`, activities.filter((activity) => Object.keys(activity).length === 0));
        activities = activities
            .filter((activity) => Object.keys(activity).length !== 0)
            .map((activity) => 
        // `recordedAt` is guaranteed by `ActivitySubscriber.beforeEntityCreate`, which
        // runs for every Activity write path (bulk save, single create, imports).
        new activity_entity_1.Activity({
            ...activity,
            ...(projectId ? { projectId } : {}),
            employeeId,
            organizationId,
            tenantId
        }));
        // Log the activities that will be inserted into the database
        console.log(`Activities should be inserted into database for employee (${user.name})`, { activities });
        // Save activities if they exist, otherwise return an empty array
        return (0, utils_1.isNotEmpty)(activities) ? await this.typeOrmActivityRepository.save(activities) : [];
    }
};
exports.BulkActivitiesSaveHandler = BulkActivitiesSaveHandler;
exports.BulkActivitiesSaveHandler = BulkActivitiesSaveHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(bulk_activities_save_command_1.BulkActivitiesSaveCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_activity_repository_1.TypeOrmActivityRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository])
], BulkActivitiesSaveHandler);
//# sourceMappingURL=bulk-activities-save.handler.js.map