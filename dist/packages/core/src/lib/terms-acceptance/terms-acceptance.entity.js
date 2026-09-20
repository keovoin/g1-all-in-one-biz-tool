"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsAcceptance = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("terms-acceptance/typeorm");
const config_1 = require("@gauzy/config");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_terms_acceptance_repository_1 = require("./repository/mikro-orm-terms-acceptance.repository");
/**
 * Fail loudly at import time if this entity and the schema published by
 * `terms-acceptance/typeorm` have drifted apart.
 *
 * A silent mismatch would truncate a digest, and a truncated digest is evidence
 * that points at nothing. Better to refuse to boot.
 */
function len(column, expected) {
    const declared = typeorm_2.termsAcceptanceEntitySchema.columns[column].length;
    if (declared !== expected) {
        throw new Error(`terms_acceptance."${String(column)}" is length ${declared} in terms-acceptance/typeorm but ` +
            `${expected} on the TermsAcceptance entity — reconcile the two and add a migration.`);
    }
    return expected;
}
/**
 * Column type for `accepted_at`, per driver.
 *
 * This matters more than it looks. The record's `fingerprint` is a digest over
 * the canonical form of every field *including* `acceptedAt` as an ISO-8601
 * string with millisecond precision, and the service re-verifies that digest on
 * every read. A column that silently drops the milliseconds would make every
 * record read back as tampered — the integrity check would fire on rows nobody
 * ever touched.
 *
 * - Postgres: `timestamptz`, microsecond precision. Exact.
 * - MySQL: `datetime` with `precision: 3`. Plain `datetime` defaults to *zero*
 *   fractional seconds and would truncate.
 * - SQLite: `datetime`, which TypeORM stores as a string carrying milliseconds.
 *
 * A plain string column is not an option here even though the value is
 * conceptually a string: the adapter binds a real `Date` to this column.
 */
function acceptedAtColumnType() {
    return (0, config_1.isPostgres)() ? 'timestamptz' : 'datetime';
}
/**
 * An acceptance of a legal document: who agreed to which exact text, when, in
 * what language, from roughly where, and — the field people forget — *how*.
 *
 * ## Why this entity does not extend `TenantBaseEntity`
 *
 * Nearly every other entity in the core does, and gets `id` (a generated uuid),
 * `createdAt` / `updatedAt` / `deletedAt`, `isActive`, `isArchived` and a tenant
 * foreign key for free. This one deliberately does not:
 *
 * 1. **The row is evidence, and evidence is append-only.** `updatedAt`,
 *    `deletedAt` and `isArchived` all describe a row that can legitimately
 *    change after the fact. This one cannot — corrections are made by recording
 *    a *new* acceptance, never by editing an old one. On Postgres the migration
 *    installs a `BEFORE UPDATE OR DELETE` trigger that raises, so the guarantee
 *    is enforced by the database rather than by convention.
 * 2. **The id is not a uuid.** `terms-acceptance` mints its own sortable id
 *    (`ta_…`) and supplies it on insert, so the column is a `varchar(128)` and
 *    not a `@PrimaryGeneratedColumn('uuid')`.
 * 3. **`tenantId` is a scope string, not a foreign key.** Deleting a tenant must
 *    not cascade away the proof that its users once agreed to something.
 *
 * The column set is exactly the one `terms-acceptance/typeorm` publishes, and
 * the lengths are asserted against it at module load.
 */
let TermsAcceptance = class TermsAcceptance {
};
exports.TermsAcceptance = TermsAcceptance;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, core_1.PrimaryKey)({ type: 'string', length: len('id', 128) }),
    (0, typeorm_1.PrimaryColumn)({ type: String, length: len('id', 128) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ name: 'subject_id', type: String, length: len('subjectId', 255) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "subjectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ name: 'tenant_id', type: String, length: len('tenantId', 255), nullable: true }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "tenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ name: 'document_id', type: String, length: len('documentId', 255) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "documentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: String, length: len('version', 64) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: String, length: len('sha256', 64) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "sha256", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => 'timestamptz' }),
    (0, entity_1.MultiORMColumn)({
        name: 'accepted_at',
        type: acceptedAtColumnType(),
        ...((0, config_1.isMySQL)() ? { precision: 3 } : {})
    }),
    tslib_1.__metadata("design:type", Object)
], TermsAcceptance.prototype, "acceptedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: String, length: len('locale', 35) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "locale", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ name: 'ip_hash', type: String, length: len('ipHash', 64), nullable: true }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "ipHash", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ name: 'user_agent', type: String, length: len('userAgent', 512), nullable: true }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "userAgent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: String, length: len('method', 64) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "method", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, entity_1.JsonColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Object)
], TermsAcceptance.prototype, "metadata", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: String, length: len('fingerprint', 64) }),
    tslib_1.__metadata("design:type", String)
], TermsAcceptance.prototype, "fingerprint", void 0);
exports.TermsAcceptance = TermsAcceptance = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('terms_acceptance', { mikroOrmRepository: () => mikro_orm_terms_acceptance_repository_1.MikroOrmTermsAcceptanceRepository })
], TermsAcceptance);
//# sourceMappingURL=terms-acceptance.entity.js.map