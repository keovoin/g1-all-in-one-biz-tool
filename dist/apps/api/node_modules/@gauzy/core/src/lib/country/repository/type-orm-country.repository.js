"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCountryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("../country.entity");
let TypeOrmCountryRepository = class TypeOrmCountryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCountryRepository = TypeOrmCountryRepository;
exports.TypeOrmCountryRepository = TypeOrmCountryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCountryRepository);
//# sourceMappingURL=type-orm-country.repository.js.map