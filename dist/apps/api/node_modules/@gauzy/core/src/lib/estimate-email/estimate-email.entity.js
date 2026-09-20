"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateEmail = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_estimate_email_repository_1 = require("./repository/mikro-orm-estimate-email.repository");
const export_redact_decorator_1 = require("../export-import/export-redact.decorator");
let EstimateEmail = class EstimateEmail extends internal_1.TenantOrganizationBaseEntity {
};
exports.EstimateEmail = EstimateEmail;
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)(),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({
        ...((0, config_1.isMySQL)() ? { type: 'text' } : {})
    }),
    tslib_1.__metadata("design:type", String)
], EstimateEmail.prototype, "token", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EstimateEmail.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], EstimateEmail.prototype, "expireDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], EstimateEmail.prototype, "convertAcceptedEstimates", void 0);
exports.EstimateEmail = EstimateEmail = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('estimate_email', { mikroOrmRepository: () => mikro_orm_estimate_email_repository_1.MikroOrmEstimateEmailRepository })
], EstimateEmail);
//# sourceMappingURL=estimate-email.entity.js.map