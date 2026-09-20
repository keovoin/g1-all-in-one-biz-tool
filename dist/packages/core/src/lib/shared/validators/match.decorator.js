"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchConstraint = exports.Match = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
/**
 * Match two fields value decorator
 *
 * @param type
 * @param property
 * @param validationOptions
 * @returns {PropertyDecorator} - Decorator function.
 */
const Match = (type, property, validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
};
exports.Match = Match;
/**
 * Match two fields value constraint.
 */
let MatchConstraint = class MatchConstraint {
    /**
     * Validate if the value matches another field's value.
     *
     * @param value - The value to validate.
     * @param args - Validation arguments.
     * @returns {boolean} - Indicates whether the validation passed.
     */
    validate(value, args) {
        const [fn] = args.constraints;
        return fn(args.object) === value;
    }
    /**
     * Gets the default validation error message.
     *
     * @param args - Validation arguments.
     * @returns {string} - The default error message.
     */
    defaultMessage(args) {
        return 'The values do not match.';
    }
};
exports.MatchConstraint = MatchConstraint;
exports.MatchConstraint = MatchConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'Match' })
], MatchConstraint);
//# sourceMappingURL=match.decorator.js.map