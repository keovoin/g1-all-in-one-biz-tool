"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_currency_repository_1 = require("./repository/mikro-orm-currency.repository");
let Currency = class Currency extends internal_1.BaseEntity {
};
exports.Currency = Currency;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], Currency.prototype, "isoCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], Currency.prototype, "currency", void 0);
exports.Currency = Currency = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('currency', { mikroOrmRepository: () => mikro_orm_currency_repository_1.MikroOrmCurrencyRepository })
], Currency);
//# sourceMappingURL=currency.entity.js.map