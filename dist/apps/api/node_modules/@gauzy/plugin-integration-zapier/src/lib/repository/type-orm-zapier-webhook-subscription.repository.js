"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmZapierWebhookSubscriptionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const zapier_webhook_subscription_entity_1 = require("../zapier-webhook-subscription.entity");
let TypeOrmZapierWebhookSubscriptionRepository = class TypeOrmZapierWebhookSubscriptionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmZapierWebhookSubscriptionRepository = TypeOrmZapierWebhookSubscriptionRepository;
exports.TypeOrmZapierWebhookSubscriptionRepository = TypeOrmZapierWebhookSubscriptionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(zapier_webhook_subscription_entity_1.ZapierWebhookSubscription)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmZapierWebhookSubscriptionRepository);
//# sourceMappingURL=type-orm-zapier-webhook-subscription.repository.js.map