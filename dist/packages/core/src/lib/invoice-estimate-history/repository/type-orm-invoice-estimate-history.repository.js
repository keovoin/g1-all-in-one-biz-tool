"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmInvoiceEstimateHistoryRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_estimate_history_entity_1 = require("../invoice-estimate-history.entity");
let TypeOrmInvoiceEstimateHistoryRepository = class TypeOrmInvoiceEstimateHistoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmInvoiceEstimateHistoryRepository = TypeOrmInvoiceEstimateHistoryRepository;
exports.TypeOrmInvoiceEstimateHistoryRepository = TypeOrmInvoiceEstimateHistoryRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(invoice_estimate_history_entity_1.InvoiceEstimateHistory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmInvoiceEstimateHistoryRepository);
//# sourceMappingURL=type-orm-invoice-estimate-history.repository.js.map