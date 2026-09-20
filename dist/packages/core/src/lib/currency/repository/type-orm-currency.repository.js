"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmCurrencyRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_entity_1 = require("../currency.entity");
let TypeOrmCurrencyRepository = class TypeOrmCurrencyRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmCurrencyRepository = TypeOrmCurrencyRepository;
exports.TypeOrmCurrencyRepository = TypeOrmCurrencyRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(currency_entity_1.Currency)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmCurrencyRepository);
//# sourceMappingURL=type-orm-currency.repository.js.map