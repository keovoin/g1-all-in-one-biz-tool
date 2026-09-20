"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const currency_entity_1 = require("./currency.entity");
const currency_controller_1 = require("./currency.controller");
const currency_service_1 = require("./currency.service");
const type_orm_currency_repository_1 = require("./repository/type-orm-currency.repository");
const mikro_orm_currency_repository_1 = require("./repository/mikro-orm-currency.repository");
let CurrencyModule = class CurrencyModule {
};
exports.CurrencyModule = CurrencyModule;
exports.CurrencyModule = CurrencyModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([currency_entity_1.Currency]), nestjs_1.MikroOrmModule.forFeature([currency_entity_1.Currency])],
        controllers: [currency_controller_1.CurrencyController],
        providers: [currency_service_1.CurrencyService, type_orm_currency_repository_1.TypeOrmCurrencyRepository, mikro_orm_currency_repository_1.MikroOrmCurrencyRepository],
        exports: [currency_service_1.CurrencyService]
    })
], CurrencyModule);
//# sourceMappingURL=currency.module.js.map