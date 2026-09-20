"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTimeLogConflictQueryDTO = exports.TimeLogConflictRelationEnum = void 0;
exports.toUtcDate = toUtcDate;
exports.toIdArray = toIdArray;
exports.toUniqueRelations = toUniqueRelations;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const moment_extend_1 = require("./../../../../core/moment-extend");
const dto_1 = require("./../../../../shared/dto");
/**
 * Relations the conflict endpoint is allowed to join and select.
 *
 * `GetConflictTimeLogHandler` turns every name in `relations` into a `leftJoinAndSelect` with no
 * further checking, so the list has to be an allow-list rather than whatever a caller invents.
 *
 * `timeSlots` is deliberately absent: the handler already inner-joins it under that exact alias, and
 * asking for it again makes TypeORM throw on the duplicate alias.
 */
var TimeLogConflictRelationEnum;
(function (TimeLogConflictRelationEnum) {
    TimeLogConflictRelationEnum["employee"] = "employee";
    TimeLogConflictRelationEnum["timesheet"] = "timesheet";
    TimeLogConflictRelationEnum["project"] = "project";
    TimeLogConflictRelationEnum["task"] = "task";
    TimeLogConflictRelationEnum["organizationContact"] = "organizationContact";
    TimeLogConflictRelationEnum["organizationTeam"] = "organizationTeam";
})(TimeLogConflictRelationEnum || (exports.TimeLogConflictRelationEnum = TimeLogConflictRelationEnum = {}));
/**
 * Parses a query value into a UTC `Date`, or `undefined` when it is not a date at all.
 *
 * The handler interpolates these values into the overlap predicate, so an unparseable one must be
 * rejected by validation rather than reaching the query as the string `null`.
 */
function toUtcDate({ value }) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const parsed = moment_extend_1.moment.utc(value instanceof Date ? value : String(value));
    return parsed.isValid() ? parsed.toDate() : undefined;
}
/**
 * Normalises `ignoreId` into an array; the UI sends it as `ignoreId[0]=<uuid>`, other callers as a
 * bare value.
 *
 * An EMPTY result is reported as `undefined`, never as `[]`. `GetConflictTimeLogHandler` guards the
 * exclusion with a plain `if (input.ignoreId)`, and an empty array is truthy: it would reach
 * `NOT IN (:...id)`, which the drivers expand by joining the values — an empty list leaves
 * `NOT IN ()` and the database rejects the statement. `?ignoreId=` used to be a falsy `''` that the
 * handler simply skipped, so anything but `undefined` here would turn a harmless query into a 500.
 */
function toIdArray({ value }) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const ids = (Array.isArray(value) ? value : [value]).filter((it) => it !== undefined && it !== null && it !== '');
    return ids.length > 0 ? ids : undefined;
}
/**
 * Parses `relations` exactly like the shared transform, then drops repeated names.
 *
 * `GetConflictTimeLogHandler` emits one `leftJoinAndSelect(..., relation)` per entry using the
 * relation name as the join alias, so `relations=project,project` would register the alias twice and
 * TypeORM would throw — a 500 on input that passes the allow-list. Order is preserved.
 */
function toUniqueRelations(params) {
    return [...new Set((0, dto_1.parseRelationsString)(params))];
}
/**
 * Get conflicting time logs request DTO validation.
 *
 * The route used to bind the raw `IGetTimeLogConflictInput` interface with no pipe at all, which
 * meant an arbitrary `employeeId`, `organizationId` and relation list flowed straight into the
 * query. Shape validation here is only half of the fix — `TimeLogService.getConflictTimeLogs`
 * decides whether the caller may read that employee's logs.
 */
class GetTimeLogConflictQueryDTO {
    constructor() {
        this.relations = [];
    }
}
exports.GetTimeLogConflictQueryDTO = GetTimeLogConflictQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], GetTimeLogConflictQueryDTO.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], GetTimeLogConflictQueryDTO.prototype, "organizationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(toUtcDate),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Date)
], GetTimeLogConflictQueryDTO.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(toUtcDate),
    (0, class_validator_1.IsDate)(),
    tslib_1.__metadata("design:type", Date)
], GetTimeLogConflictQueryDTO.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => [String], isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toIdArray),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetTimeLogConflictQueryDTO.prototype, "ignoreId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: TimeLogConflictRelationEnum, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(toUniqueRelations),
    (0, class_validator_1.IsEnum)(TimeLogConflictRelationEnum, { each: true }),
    tslib_1.__metadata("design:type", Array)
], GetTimeLogConflictQueryDTO.prototype, "relations", void 0);
//# sourceMappingURL=get-time-log-conflict-query.dto.js.map