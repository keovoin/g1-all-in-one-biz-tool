"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEmployeeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const internal_1 = require("./../../core/entities/internal");
const public_employee_controller_1 = require("./public-employee.controller");
const public_employee_service_1 = require("./public-employee.service");
const handlers_1 = require("./queries/handlers");
const nestjs_1 = require("@mikro-orm/nestjs");
let PublicEmployeeModule = class PublicEmployeeModule {
};
exports.PublicEmployeeModule = PublicEmployeeModule;
exports.PublicEmployeeModule = PublicEmployeeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, typeorm_1.TypeOrmModule.forFeature([internal_1.Employee]), nestjs_1.MikroOrmModule.forFeature([internal_1.Employee])],
        controllers: [public_employee_controller_1.PublicEmployeeController],
        providers: [public_employee_service_1.PublicEmployeeService, ...handlers_1.QueryHandlers]
    })
], PublicEmployeeModule);
//# sourceMappingURL=public-employee.module.js.map