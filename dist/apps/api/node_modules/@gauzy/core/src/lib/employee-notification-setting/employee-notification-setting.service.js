"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationSettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const tenant_aware_crud_service_1 = require("../core/crud/tenant-aware-crud.service");
const request_context_1 = require("../core/context/request-context");
const type_orm_employee_notification_setting_repository_1 = require("./repository/type-orm-employee-notification-setting.repository");
const mikro_orm_employee_notification_setting_repository_1 = require("./repository/mikro-orm-employee-notification-setting.repository");
let EmployeeNotificationSettingService = class EmployeeNotificationSettingService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmEmployeeNotificationSettingRepository, mikroOrmEmployeeNotificationSettingRepository) {
        super(typeOrmEmployeeNotificationSettingRepository, mikroOrmEmployeeNotificationSettingRepository);
        this.typeOrmEmployeeNotificationSettingRepository = typeOrmEmployeeNotificationSettingRepository;
        this.mikroOrmEmployeeNotificationSettingRepository = mikroOrmEmployeeNotificationSettingRepository;
    }
    /**
     * Creates an employee notification setting record
     *
     * @param {IEmployeeNotificationSetting} input - The input data for creating a notification setting
     * @returns {Promise<EmployeeNotificationSetting>} The created notification setting
     */
    async create(input) {
        try {
            const user = request_context_1.RequestContext.currentUser();
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const employeeId = input.employeeId ?? user?.employeeId;
            return super.create({ ...input, employeeId, tenantId });
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to create the notification setting: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.EmployeeNotificationSettingService = EmployeeNotificationSettingService;
exports.EmployeeNotificationSettingService = EmployeeNotificationSettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_employee_notification_setting_repository_1.TypeOrmEmployeeNotificationSettingRepository,
        mikro_orm_employee_notification_setting_repository_1.MikroOrmEmployeeNotificationSettingRepository])
], EmployeeNotificationSettingService);
//# sourceMappingURL=employee-notification-setting.service.js.map