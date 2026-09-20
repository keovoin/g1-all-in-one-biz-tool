"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const email_send_module_1 = require("./../email-send/email-send.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const payment_entity_1 = require("./payment.entity");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const payment_map_service_1 = require("./payment.map.service");
const type_orm_payment_repository_1 = require("./repository/type-orm-payment.repository");
const mikro_orm_payment_repository_1 = require("./repository/mikro-orm-payment.repository");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment]),
            nestjs_1.MikroOrmModule.forFeature([payment_entity_1.Payment]),
            role_permission_module_1.RolePermissionModule,
            email_send_module_1.EmailSendModule
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, payment_map_service_1.PaymentMapService, type_orm_payment_repository_1.TypeOrmPaymentRepository, mikro_orm_payment_repository_1.MikroOrmPaymentRepository],
        exports: [payment_service_1.PaymentService, payment_map_service_1.PaymentMapService, type_orm_payment_repository_1.TypeOrmPaymentRepository, mikro_orm_payment_repository_1.MikroOrmPaymentRepository]
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map