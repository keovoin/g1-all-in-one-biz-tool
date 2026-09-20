"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPluginBillingRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plugin_billing_entity_1 = require("../entities/plugin-billing.entity");
let TypeOrmPluginBillingRepository = class TypeOrmPluginBillingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPluginBillingRepository = TypeOrmPluginBillingRepository;
exports.TypeOrmPluginBillingRepository = TypeOrmPluginBillingRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(plugin_billing_entity_1.PluginBilling)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPluginBillingRepository);
//# sourceMappingURL=type-orm-plugin-billing.repository.js.map