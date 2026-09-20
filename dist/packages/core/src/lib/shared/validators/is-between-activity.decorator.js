"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetweenActivityConstraint = exports.IsBetweenActivity = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
/**
 * IsBetweenActivity custom decorator.
 *
 * @param validationOptions - Validation options.
 * @returns {PropertyDecorator} - Decorator function.
 */
const IsBetweenActivity = (type, property, validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: BetweenActivityConstraint
        });
    };
};
exports.IsBetweenActivity = IsBetweenActivity;
/**
 * Is between activity check validation constraint
 *
 * @param validationOptions
 * @returns
 */
let BetweenActivityConstraint = class BetweenActivityConstraint {
    /**
     * Validate if the start and end values in the activityLevel object are between 0 and 100 (inclusive).
     *
     * @param activityLevel - The object containing start and end properties to be validated.
     * @param args - Validation arguments.
     * @returns {boolean} - Returns `true` if both start and end values are between 0 and 100 (inclusive); otherwise, `false`.
     */
    validate(activityLevel, args) {
        const { start, end } = activityLevel;
        // Check if start and end values are within the range [0, 100]
        return start >= 0 && end <= 100;
    }
    /**
     * Get the default error message for the IsBetweenActivity constraint.
     *
     * @param args - Validation arguments.
     * @returns {string} - The default error message.
     */
    defaultMessage(args) {
        return 'Start & End must be between 0 and 100';
    }
};
exports.BetweenActivityConstraint = BetweenActivityConstraint;
exports.BetweenActivityConstraint = BetweenActivityConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsBetweenActivity', async: false })
], BetweenActivityConstraint);
//# sourceMappingURL=is-between-activity.decorator.js.map