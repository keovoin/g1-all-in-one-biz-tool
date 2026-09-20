"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const country_entity_1 = require("./country.entity");
const country_controller_1 = require("./country.controller");
const country_service_1 = require("./country.service");
const type_orm_country_repository_1 = require("./repository/type-orm-country.repository");
const mikro_orm_country_repository_1 = require("./repository/mikro-orm-country.repository");
let CountryModule = class CountryModule {
};
exports.CountryModule = CountryModule;
exports.CountryModule = CountryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([country_entity_1.Country]), nestjs_1.MikroOrmModule.forFeature([country_entity_1.Country])],
        controllers: [country_controller_1.CountryController],
        providers: [country_service_1.CountryService, type_orm_country_repository_1.TypeOrmCountryRepository, mikro_orm_country_repository_1.MikroOrmCountryRepository]
    })
], CountryModule);
//# sourceMappingURL=country.module.js.map