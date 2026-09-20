"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationsQueryDTO = void 0;
exports.parseRelationsString = parseRelationsString;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Parses a comma-separated relations string (or string array) into a
 * trimmed, non-empty string array.  Re-exported so that DTOs with
 * stricter enum constraints can reuse the same transform logic.
 */
function parseRelationsString({ value }) {
    if (value === undefined || value === null) {
        return [];
    }
    if (typeof value === 'string') {
        return value
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
    }
    if (Array.isArray(value)) {
        return value
            .filter((v) => typeof v === 'string')
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
    }
    return [];
}
/**
 * Validates and transforms 'relations' query parameter.
 */
class RelationsQueryDTO {
    constructor() {
        this.relations = [];
    }
}
exports.RelationsQueryDTO = RelationsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [String], isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Transform)(parseRelationsString),
    tslib_1.__metadata("design:type", Array)
], RelationsQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=relations-query.dto.js.map