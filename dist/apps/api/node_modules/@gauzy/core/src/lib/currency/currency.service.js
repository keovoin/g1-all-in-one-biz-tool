"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../core/crud/crud.service");
const type_orm_currency_repository_1 = require("./repository/type-orm-currency.repository");
const mikro_orm_currency_repository_1 = require("./repository/mikro-orm-currency.repository");
let CurrencyService = class CurrencyService extends crud_service_1.CrudService {
    constructor(typeOrmCurrencyRepository, mikroOrmCurrencyRepository) {
        super(typeOrmCurrencyRepository, mikroOrmCurrencyRepository);
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_currency_repository_1.TypeOrmCurrencyRepository,
        mikro_orm_currency_repository_1.MikroOrmCurrencyRepository])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map