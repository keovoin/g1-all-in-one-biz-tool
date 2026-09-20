"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContact = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_contact_repository_1 = require("./repository/mikro-orm-organization-contact.repository");
const decorators_1 = require("../shared/decorators");
let OrganizationContact = class OrganizationContact extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationContact = OrganizationContact;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, decorators_1.Trimmed)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "primaryEmail", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "primaryPhone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ContactOrganizationInviteStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ContactOrganizationInviteStatus),
    (0, entity_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.ContactOrganizationInviteStatus }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "inviteStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ContactType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ContactType),
    (0, entity_1.MultiORMColumn)({ type: 'simple-enum', enum: contracts_1.ContactType, default: contracts_1.ContactType.CLIENT }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "contactType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ nullable: true, length: 500 }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationContact.prototype, "budget", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationContactBudgetTypeEnum),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        type: 'simple-enum',
        enum: contracts_1.OrganizationContactBudgetTypeEnum,
        default: contracts_1.OrganizationContactBudgetTypeEnum.COST
    }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "budgetType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Contact }),
    (0, entity_1.MultiORMOneToOne)(() => internal_1.Contact, (contact) => contact.organizationContact, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        cascade: true, // If set to true then it means that related object can be allowed to be inserted or updated in the database.
        onDelete: 'SET NULL', // Database cascade action on delete.
        owner: true // This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationContact.prototype, "contact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.contact),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "contactId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        nullable: true, // Indicates if relation column value can be nullable or not.
        onDelete: 'SET NULL', // Database cascade action on delete.
        eager: true // Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationContact.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.image),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationContact.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.OrganizationProject, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationProject, (it) => it.organizationContact, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Invoice, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Invoice, (it) => it.toContact),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "invoices", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Payment, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Payment, (it) => it.organizationContact, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "payments", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Expense, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Expense, (it) => it.organizationContact, { onDelete: 'SET NULL' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "expenses", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Income, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Income, (it) => it.client, { onDelete: 'SET NULL' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "incomes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.TimeLog, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeLog, (it) => it.organizationContact),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "timeLogs", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.organizationContacts, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization_contact',
        joinColumn: 'organizationContactId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_organization_contact' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Employee, (it) => it.organizationContacts, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'organization_contact_employee',
        joinColumn: 'organizationContactId',
        inverseJoinColumn: 'employeeId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'organization_contact_employee' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationContact.prototype, "members", void 0);
exports.OrganizationContact = OrganizationContact = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_contact', { mikroOrmRepository: () => mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository })
], OrganizationContact);
//# sourceMappingURL=organization-contact.entity.js.map