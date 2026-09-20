"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEntitySubscriptionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_subscription_entity_1 = require("../entity-subscription.entity");
let TypeOrmEntitySubscriptionRepository = class TypeOrmEntitySubscriptionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEntitySubscriptionRepository = TypeOrmEntitySubscriptionRepository;
exports.TypeOrmEntitySubscriptionRepository = TypeOrmEntitySubscriptionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(entity_subscription_entity_1.EntitySubscription)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEntitySubscriptionRepository);
//# sourceMappingURL=type-orm-entity-subscription.repository.js.map