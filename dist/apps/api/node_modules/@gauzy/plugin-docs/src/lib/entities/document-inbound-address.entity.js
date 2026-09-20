"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentInboundAddress = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const mikro_orm_document_inbound_address_repository_1 = require("../repositories/mikro-orm-document-inbound-address.repository");
/**
 * An organization's inbound email capture address.
 *
 * ## Why this is its own table
 *
 * The previous design encoded the capture token as a `tenant_setting` row named
 * `docs.<organizationId>.inboundToken`. That has three defects this entity fixes:
 *
 * 1. `tenant_setting` has **no `organizationId` column**, so the organization id was parsed back out
 *    of the setting *name* with `name.split('.')[1]`.
 * 2. It has **no index and no unique constraint** on `name`/`value`, so resolving an inbound message
 *    was a `LIKE 'docs.%.inboundToken'` full-table scan on every delivery, with nothing preventing
 *    two organizations from holding the same token.
 * 3. Nothing ever wrote the row, so resolution always failed and every delivery 404'd.
 *
 * ## The unique index is a security control, not an optimization
 *
 * `IDX_document_inbound_address_address` is UNIQUE across the whole deployment. An inbound message is
 * routed purely by its recipient address, so two rows sharing one address would make the destination
 * tenant depend on row order — a cross-tenant delivery. The database is the right place to make that
 * unrepresentable.
 *
 * ## 🛑 Only `varchar` and `text` are declared explicitly
 *
 * Dates, booleans and integers deliberately carry NO `type:` — TypeORM infers them from the
 * TypeScript type and maps each database appropriately. Writing `type: 'timestamp'` looks harmless
 * and passes every Postgres check, but **better-sqlite3 rejects it outright**
 * (`DataTypeNotSupportedError`) and the API crash-loops at boot. Demo runs SQLite while stage and
 * production run PostgreSQL, so this cannot be caught by testing one of them. No other entity in
 * this plugin declares anything but `varchar`/`text`; keep it that way.
 */
let DocumentInboundAddress = class DocumentInboundAddress extends core_1.TenantOrganizationBaseEntity {
    /**
     * `senderAllowlistRaw` as a list. Not a column — derived on read.
     */
    get senderAllowlist() {
        if (!this.senderAllowlistRaw) {
            return null;
        }
        try {
            const parsed = JSON.parse(this.senderAllowlistRaw);
            return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === 'string') : null;
        }
        catch {
            // A malformed value must not fail the delivery it is meant to guard; treat it as "unset"
            // so the SPF/DKIM gate still applies.
            return null;
        }
    }
};
exports.DocumentInboundAddress = DocumentInboundAddress;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentInboundAddressKindEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentInboundAddressKindEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentInboundAddressKindEnum.PLATFORM }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "kind", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ExportRedacted)(),
    (0, core_1.ColumnIndex)('IDX_document_inbound_address_token'),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 128, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 255, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "domain", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "localPart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)()
    // A PLATFORM address is `docs-<token>@domain`: it embeds the token, and "the address itself is the
    // credential" (InboundAddressService), so masking `token` alone would leave it in the archive. Only
    // the token part is masked, keeping the domain readable; anything not explicitly CUSTOM_DOMAIN (a
    // chosen, guessable local part that grants nothing without DNS proof) is treated as PLATFORM.
    ,
    (0, core_1.ExportRedacted)({
        when: (it) => it.kind !== contracts_1.DocumentInboundAddressKindEnum.CUSTOM_DOMAIN,
        mask: (value, it) => (0, core_1.maskEmbeddedSecret)(value, it.token)
    }),
    (0, core_1.ColumnIndex)('IDX_document_inbound_address_address', { unique: true }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 320 }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "address", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.DocumentInboundDomainStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.DocumentInboundDomainStatusEnum),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 16, default: contracts_1.DocumentInboundDomainStatusEnum.PENDING }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "domainStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 128, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "domainVerificationToken", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], DocumentInboundAddress.prototype, "domainVerifiedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], DocumentInboundAddress.prototype, "domainLastCheckedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ExportRedacted)({ blank: true }),
    (0, core_1.MultiORMColumn)({ type: 'varchar', length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "webhookSecretHash", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], DocumentInboundAddress.prototype, "senderAllowlistRaw", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], DocumentInboundAddress.prototype, "importBodyAsNote", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], DocumentInboundAddress.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], DocumentInboundAddress.prototype, "lastMessageAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, core_1.MultiORMColumn)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], DocumentInboundAddress.prototype, "messageCount", void 0);
exports.DocumentInboundAddress = DocumentInboundAddress = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('document_inbound_address', {
        mikroOrmRepository: () => mikro_orm_document_inbound_address_repository_1.MikroOrmDocumentInboundAddressRepository
    }),
    (0, core_1.ColumnIndex)('IDX_document_inbound_address_tenant_org', ['tenantId', 'organizationId'])
], DocumentInboundAddress);
//# sourceMappingURL=document-inbound-address.entity.js.map