"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPaymentRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../payment.entity");
let TypeOrmPaymentRepository = class TypeOrmPaymentRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPaymentRepository = TypeOrmPaymentRepository;
exports.TypeOrmPaymentRepository = TypeOrmPaymentRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPaymentRepository);
//# sourceMappingURL=type-orm-payment.repository.js.map