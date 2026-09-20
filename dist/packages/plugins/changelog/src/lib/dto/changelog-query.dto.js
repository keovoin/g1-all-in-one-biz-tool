"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * Get changelog request DTO validation.
 *
 * The validated object is used directly as a TypeORM `where`, so this DTO is
 * the whitelist: only declare properties that are safe to filter on. The UI
 * sends `isFeature=0|1`, which arrives as a string — hence the transform.
 * Unrecognized values pass through untouched so `@IsBoolean` rejects them
 * instead of silently coercing to `false`.
 */
class ChangelogQueryDTO {
}
exports.ChangelogQueryDTO = ChangelogQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value == null || typeof value === 'boolean') {
            return value;
        }
        const normalized = String(value).toLowerCase().trim();
        if (normalized === 'true' || normalized === '1') {
            return true;
        }
        if (normalized === 'false' || normalized === '0') {
            return false;
        }
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], ChangelogQueryDTO.prototype, "isFeature", void 0);
//# sourceMappingURL=changelog-query.dto.js.map