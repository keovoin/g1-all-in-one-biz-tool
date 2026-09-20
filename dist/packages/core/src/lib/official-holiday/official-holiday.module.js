"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficialHolidayModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("./../role-permission/role-permission.module");
const official_holiday_entity_1 = require("./official-holiday.entity");
const official_holiday_controller_1 = require("./official-holiday.controller");
const official_holiday_service_1 = require("./official-holiday.service");
const mikro_orm_official_holiday_repository_1 = require("./repository/mikro-orm-official-holiday.repository");
const type_orm_official_holiday_repository_1 = require("./repository/type-orm-official-holiday.repository");
let OfficialHolidayModule = class OfficialHolidayModule {
};
exports.OfficialHolidayModule = OfficialHolidayModule;
exports.OfficialHolidayModule = OfficialHolidayModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([official_holiday_entity_1.OfficialHoliday]),
            nestjs_1.MikroOrmModule.forFeature([official_holiday_entity_1.OfficialHoliday]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [official_holiday_controller_1.OfficialHolidayController],
        providers: [official_holiday_service_1.OfficialHolidayService, type_orm_official_holiday_repository_1.TypeOrmOfficialHolidayRepository, mikro_orm_official_holiday_repository_1.MikroOrmOfficialHolidayRepository],
        exports: [official_holiday_service_1.OfficialHolidayService, type_orm_official_holiday_repository_1.TypeOrmOfficialHolidayRepository, mikro_orm_official_holiday_repository_1.MikroOrmOfficialHolidayRepository]
    })
], OfficialHolidayModule);
//# sourceMappingURL=official-holiday.module.js.map