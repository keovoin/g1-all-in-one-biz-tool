"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalEmployeeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_approval_employee_entity_1 = require("./request-approval-employee.entity");
const nestjs_1 = require("@mikro-orm/nestjs");
let RequestApprovalEmployeeModule = class RequestApprovalEmployeeModule {
};
exports.RequestApprovalEmployeeModule = RequestApprovalEmployeeModule;
exports.RequestApprovalEmployeeModule = RequestApprovalEmployeeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([request_approval_employee_entity_1.RequestApprovalEmployee]),
            nestjs_1.MikroOrmModule.forFeature([request_approval_employee_entity_1.RequestApprovalEmployee]),
        ]
    })
], RequestApprovalEmployeeModule);
//# sourceMappingURL=request-approval-employee.module.js.map