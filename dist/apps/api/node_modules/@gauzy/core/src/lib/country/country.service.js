"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../core/crud/crud.service");
const type_orm_country_repository_1 = require("./repository/type-orm-country.repository");
const mikro_orm_country_repository_1 = require("./repository/mikro-orm-country.repository");
let CountryService = class CountryService extends crud_service_1.CrudService {
    constructor(typeOrmCountryRepository, mikroOrmCountryRepository) {
        super(typeOrmCountryRepository, mikroOrmCountryRepository);
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_country_repository_1.TypeOrmCountryRepository,
        mikro_orm_country_repository_1.MikroOrmCountryRepository])
], CountryService);
//# sourceMappingURL=country.service.js.map