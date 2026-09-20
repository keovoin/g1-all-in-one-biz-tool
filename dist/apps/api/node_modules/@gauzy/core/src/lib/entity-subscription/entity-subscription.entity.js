"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySubscription = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const pipes_1 = require("../shared/pipes");
const mikro_orm_entity_subscription_repository_1 = require("./repository/mikro-orm-entity-subscription.repository");
let EntitySubscription = class EntitySubscription extends internal_1.BasePerEntityType {
};
exports.EntitySubscription = EntitySubscription;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.ActorTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActorTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'int', nullable: true, transformer: new pipes_1.ActorTypeTransformer() }),
    tslib_1.__metadata("design:type", String)
], EntitySubscription.prototype, "actorType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.EntitySubscriptionTypeEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.EntitySubscriptionTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EntitySubscription.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Employee }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        nullable: true, // Indicates if relation column value can be null.
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], EntitySubscription.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EntitySubscription.prototype, "employeeId", void 0);
exports.EntitySubscription = EntitySubscription = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('entity_subscription', { mikroOrmRepository: () => mikro_orm_entity_subscription_repository_1.MikroOrmEntitySubscriptionRepository })
], EntitySubscription);
//# sourceMappingURL=entity-subscription.entity.js.map