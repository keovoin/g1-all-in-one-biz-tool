"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNativeParameters = exports.parseBool = exports.BaseQueryDTO = exports.PaginationQueryDTO = exports.FindOptionsQueryDTO = exports.FindWhereQueryDTO = exports.FindRelationsQueryDTO = exports.FindSelectQueryDTO = void 0;
exports.escapeQueryWithParameters = escapeQueryWithParameters;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utils_1 = require("@gauzy/utils");
const utils_2 = require("../utils");
const tenant_organization_base_dto_1 = require("./tenant-organization-base.dto");
/**
 * Base DTO for 'select' fields. What fields should be selected.
 */
class FindSelectQueryDTO {
}
exports.FindSelectQueryDTO = FindSelectQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseObject)(value, utils_1.parseToBoolean)),
    tslib_1.__metadata("design:type", Object)
], FindSelectQueryDTO.prototype, "select", void 0);
/**
 * Base DTO for 'relations' to load (joined entities).
 */
class FindRelationsQueryDTO extends FindSelectQueryDTO {
}
exports.FindRelationsQueryDTO = FindRelationsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_2.canonicalizeFindOptionsRelations)(value)),
    tslib_1.__metadata("design:type", Object)
], FindRelationsQueryDTO.prototype, "relations", void 0);
/**
 * Simple condition that should be applied to match entities.
 */
class FindWhereQueryDTO extends FindRelationsQueryDTO {
}
exports.FindWhereQueryDTO = FindWhereQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Object }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => tenant_organization_base_dto_1.TenantOrganizationBaseDTO),
    (0, class_transformer_1.Transform)(({ value }) => (value ? escapeQueryWithParameters(value) : {})),
    tslib_1.__metadata("design:type", Object)
], FindWhereQueryDTO.prototype, "where", void 0);
/**
 * Base DTO for filtering options (ordering, soft-delete, etc.).
 */
class FindOptionsQueryDTO extends FindWhereQueryDTO {
}
exports.FindOptionsQueryDTO = FindOptionsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], FindOptionsQueryDTO.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'boolean' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], FindOptionsQueryDTO.prototype, "withDeleted", void 0);
/**
 * Base DTO for pagination (skip/take).
 */
class PaginationQueryDTO extends FindOptionsQueryDTO {
}
exports.PaginationQueryDTO = PaginationQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'number', minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Transform)((params) => Number.parseInt(params.value, 10)),
    tslib_1.__metadata("design:type", Number)
], PaginationQueryDTO.prototype, "take", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => 'number', minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)((params) => Number.parseInt(params.value, 10)),
    tslib_1.__metadata("design:type", Number)
], PaginationQueryDTO.prototype, "skip", void 0);
/**
 * Describes generic query params
 */
class BaseQueryDTO extends PaginationQueryDTO {
}
exports.BaseQueryDTO = BaseQueryDTO;
/**
 * Function to escape query parameters and convert to DTO class.
 * @param nativeParameters - The original query parameters.
 * @returns {TenantOrganizationBaseDTO} - The escaped and converted query parameters as a DTO instance.
 */
function escapeQueryWithParameters(nativeParameters) {
    // Convert native parameters based on the database connection type
    const builtParameters = (0, exports.convertNativeParameters)(nativeParameters);
    // Convert to DTO class using class-transformer's plainToClass
    return (0, class_transformer_1.plainToClass)(tenant_organization_base_dto_1.TenantOrganizationBaseDTO, builtParameters, { enableImplicitConversion: true });
}
/**
 * Parses the given value and converts it to a boolean using JSON.parse.
 *
 * @param value - The value to be parsed.
 * @returns {boolean} - The boolean representation of the parsed value.
 */
const parseBool = (value) => Boolean(JSON.parse(value));
exports.parseBool = parseBool;
/**
 * Converts native parameters based on the database connection type.
 *
 * @param parameters - The parameters to be converted.
 * @returns {any} - The converted parameters based on the database connection type.
 */
const convertNativeParameters = (parameters) => {
    try {
        if (Array.isArray(parameters)) {
            // Process each array item recursively
            return parameters.map((item) => (0, exports.convertNativeParameters)(item));
        }
        if (typeof parameters === 'object' && parameters !== null) {
            // Recursively convert nested objects
            return Object.keys(parameters).reduce((acc, key) => {
                acc[key] = (0, exports.convertNativeParameters)(parameters[key]);
                return acc;
            }, {});
        }
        // Convert boolean values to their numeric representation
        return (0, exports.parseBool)(parameters);
    }
    catch (error) {
        return parameters;
    }
};
exports.convertNativeParameters = convertNativeParameters;
//# sourceMappingURL=base-query.dto.js.map