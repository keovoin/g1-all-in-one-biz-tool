"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_deal_repository_1 = require("./repository/mikro-orm-deal.repository");
let Deal = class Deal extends internal_1.TenantOrganizationBaseEntity {
};
exports.Deal = Deal;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Deal.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], Deal.prototype, "probability", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.PipelineStage, {
        onDelete: 'CASCADE' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Deal.prototype, "stage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, typeorm_1.RelationId)((it) => it.stage),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], Deal.prototype, "stageId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.OrganizationContact, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'CASCADE', // Database cascade action on delete.
        owner: true // This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Deal.prototype, "client", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.client),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Deal.prototype, "clientId", void 0);
exports.Deal = Deal = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('deal', { mikroOrmRepository: () => mikro_orm_deal_repository_1.MikroOrmDealRepository })
], Deal);
//# sourceMappingURL=deal.entity.js.map