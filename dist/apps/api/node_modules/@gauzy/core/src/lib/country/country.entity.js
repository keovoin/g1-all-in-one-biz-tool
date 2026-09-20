"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_country_repository_1 = require("./repository/mikro-orm-country.repository");
let Country = class Country extends internal_1.BaseEntity {
};
exports.Country = Country;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], Country.prototype, "isoCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], Country.prototype, "country", void 0);
exports.Country = Country = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('country', { mikroOrmRepository: () => mikro_orm_country_repository_1.MikroOrmCountryRepository })
], Country);
//# sourceMappingURL=country.entity.js.map