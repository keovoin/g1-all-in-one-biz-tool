"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomTrackingSessionsQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const utils_1 = require("@gauzy/utils");
const dto_1 = require("../../../shared/dto");
/**
 * DTO for querying custom tracking sessions
 */
class CustomTrackingSessionsQueryDTO extends (0, swagger_1.IntersectionType)(dto_1.FiltersQueryDTO, (0, swagger_1.IntersectionType)(dto_1.SelectorsQueryDTO, dto_1.RelationsQueryDTO)) {
    constructor() {
        super(...arguments);
        /**
         * Whether to group by sessionId
         */
        this.groupBySession = true;
        /**
         * Whether to include decoded data in the response
         */
        this.includeDecodedData = false;
    }
}
exports.CustomTrackingSessionsQueryDTO = CustomTrackingSessionsQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: 'Whether to group tracking sessions by sessionId',
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === undefined || value === null || value === '' ? undefined : (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], CustomTrackingSessionsQueryDTO.prototype, "groupBySession", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        default: false,
        description: 'Whether to include decoded data in the response. By default, only encoded data is returned.'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === undefined || value === null || value === '' ? undefined : (0, utils_1.parseToBoolean)(value)),
    tslib_1.__metadata("design:type", Boolean)
], CustomTrackingSessionsQueryDTO.prototype, "includeDecodedData", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Filter tracking sessions by session ID'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CustomTrackingSessionsQueryDTO.prototype, "sessionId", void 0);
//# sourceMappingURL=custom-tracking-sessions-query.dto.js.map