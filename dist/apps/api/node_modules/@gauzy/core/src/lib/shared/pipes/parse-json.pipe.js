"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseJsonPipe = exports.MAX_QUERY_JSON_DEPTH = void 0;
exports.omitNullValues = omitNullValues;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const http_error_by_code_util_1 = require("@nestjs/common/utils/http-error-by-code.util");
const class_validator_1 = require("class-validator");
/**
 * Drops object properties whose value is `null`, recursively (array elements are recursed into but
 * never removed). Rebuilt with `Object.fromEntries`, which defines own data properties and so cannot
 * be used to reach `__proto__`.
 *
 * Why: this pipe feeds client-supplied `?data={ findInput, relations, ... }` filter objects straight
 * into TypeORM `where` clauses. At this ingress a JSON `null` has only ever meant "not filtered on
 * this key" (TypeORM 0.3 skipped it, and the clients were written against that). TypeORM is now
 * configured to translate `null` into `IS NULL` — the fail-closed choice for server code, which spells
 * `IS NULL` out with the explicit `IsNull()` operator — so the client's meaning is preserved here by
 * removing the key before the value ever reaches a query. See TYPEORM_INVALID_WHERE_VALUES_BEHAVIOR
 * in @gauzy/config (GHSA-44pv-34gx-q9p4).
 */
/** Maximum nesting depth accepted for a `?data=` JSON query object. */
exports.MAX_QUERY_JSON_DEPTH = 32;
function omitNullValues(value, depth = 0) {
    // A filter object is a handful of levels deep at most; refuse pathological nesting instead of
    // letting a crafted payload exhaust the stack (which would surface as a swallowed parse error).
    if (depth > exports.MAX_QUERY_JSON_DEPTH) {
        throw new common_1.BadRequestException('Query JSON is nested too deeply');
    }
    if (Array.isArray(value)) {
        return value.map((item) => omitNullValues(item, depth + 1));
    }
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value)
            .filter(([, v]) => v !== null)
            .map(([k, v]) => [k, omitNullValues(v, depth + 1)]));
    }
    return value;
}
/**
 * JSON Parse Pipe
 * Parses a JSON-encoded query parameter (e.g. `?data={...}`) into an object. `null` property values
 * are dropped (see {@link omitNullValues}).
 */
let ParseJsonPipe = class ParseJsonPipe {
    /**
     * Instance of class-validator
     * Can not be easily injected, and there's no need to do so as we
     * only use it for json validation method.
     */
    constructor(options) {
        options = options || {};
        const { exceptionFactory, errorHttpStatusCode = common_1.HttpStatus.BAD_REQUEST, throwInvalidError = false } = options;
        this.throwInvalidError = throwInvalidError;
        this.exceptionFactory =
            exceptionFactory ||
                ((error) => new http_error_by_code_util_1.HttpErrorByCode[errorHttpStatusCode](error));
    }
    /**
     * @param value currently processed route argument
     * @param metadata contains metadata about the currently processed route argument
     */
    async transform(value, metadata) {
        const isJson = (0, class_validator_1.isJSON)(value);
        if (isJson) {
            let parsed;
            try {
                parsed = JSON.parse(value);
            }
            catch (e) {
                console.log('Json Parser Error:', e);
                return {};
            }
            // Outside the parse try: a sanitizer failure (e.g. excessive nesting) is the caller's error
            // and must surface as a 400, not be swallowed as "invalid JSON" and turned into {}.
            return omitNullValues(parsed);
        }
        else if (this.throwInvalidError) {
            throw this.exceptionFactory('Validation failed (JSON string is expected)');
        }
        return {};
    }
};
exports.ParseJsonPipe = ParseJsonPipe;
exports.ParseJsonPipe = ParseJsonPipe = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__metadata("design:paramtypes", [Object])
], ParseJsonPipe);
//# sourceMappingURL=parse-json.pipe.js.map