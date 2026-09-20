"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeDateConstraint = exports.IsBeforeDate = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const moment = require("moment");
/**
 *
 * @param type
 * @param property
 * @param validationOptions
 * @returns {PropertyDecorator} - Decorator function.
 */
const IsBeforeDate = (type, property, validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: BeforeDateConstraint,
        });
    };
};
exports.IsBeforeDate = IsBeforeDate;
/**
 * Is before date check validation constraint
 *
 * @param validationOptions
 * @returns
 */
let BeforeDateConstraint = class BeforeDateConstraint {
    /**
     * Validate if the start date is before the end date.
     *
     * @param value - The date to be validated.
     * @param args - Validation arguments, including constraints.
     * @returns {boolean} - Returns `true` if the start date is before the end date; otherwise, `false`.
     */
    validate(value, args) {
        const [fn] = args.constraints;
        // Check for undefined, null, or invalid function
        if (!value || !fn || typeof fn !== 'function') {
            return false;
        }
        // Convert dates to moment objects
        const start = moment(value);
        const end = moment(fn(args.object));
        // Check if both dates are valid
        if (!start.isValid() || !end.isValid()) {
            return false;
        }
        // Perform the validation
        return start.isBefore(end);
    }
    /**
     * Get the default error message for the IsBeforeDate constraint.
     *
     * @param args - Validation arguments.
     * @returns {string} - The default error message.
     */
    defaultMessage(args) {
        const { value } = args;
        return `The start date "${value}" must be before the end date.`;
    }
};
exports.BeforeDateConstraint = BeforeDateConstraint;
exports.BeforeDateConstraint = BeforeDateConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "IsBeforeDate", async: false })
], BeforeDateConstraint);
//# sourceMappingURL=is-before-date.decorator.js.map