"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const pipes_1 = require("./../shared/pipes");
const mikro_orm_payment_repository_1 = require("./repository/mikro-orm-payment.repository");
let Payment = class Payment extends internal_1.TenantOrganizationBaseEntity {
};
exports.Payment = Payment;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Payment.prototype, "paymentDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'numeric', transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "note", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.CurrenciesEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.PaymentMethodEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PaymentMethodEnum),
    (0, entity_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.PaymentMethodEnum }),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Payment.prototype, "overdue", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'SET NULL' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Payment.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Invoice }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Invoice, (invoice) => invoice.payments, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'SET NULL' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Payment.prototype, "invoice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.invoice),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "invoiceId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.OrganizationProject }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.payments, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'SET NULL' // Defines the database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Payment.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.OrganizationContact }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationContact, (it) => it.payments, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'SET NULL' // Database cascade action on delete.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Payment.prototype, "organizationContact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationContact),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Payment.prototype, "organizationContactId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (it) => it.payments, {
        onUpdate: 'CASCADE', // Defines the database action to perform on update.
        onDelete: 'CASCADE', // Defines the database cascade action on delete.
        owner: true, // Defines the database relation as owner.
        pivotTable: 'tag_payment', // Defines the pivot table name.
        joinColumn: 'paymentId', // Defines the join column name.
        inverseJoinColumn: 'tagId' // Defines the inverse join column name.
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_payment' }),
    tslib_1.__metadata("design:type", Array)
], Payment.prototype, "tags", void 0);
exports.Payment = Payment = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('payment', { mikroOrmRepository: () => mikro_orm_payment_repository_1.MikroOrmPaymentRepository })
], Payment);
//# sourceMappingURL=payment.entity.js.map