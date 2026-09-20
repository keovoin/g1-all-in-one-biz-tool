"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLengthConstraint = exports.CustomLength = void 0;
exports.length = length;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const constants_1 = require("@gauzy/constants");
function length(text, length) {
    return (typeof text === 'string' && typeof length === 'number') && (text.length == length);
}
/**
 * Custom length validation decorator.
 *
 * @param length - The expected length of the property. Defaults to ALPHA_NUMERIC_CODE_LENGTH.
 * @param validationOptions - Options for the validation decorator.
 * @returns {PropertyDecorator} - Decorator function.
 */
const CustomLength = (length = constants_1.ALPHA_NUMERIC_CODE_LENGTH, validationOptions) => {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [length],
            validator: CustomLengthConstraint,
        });
    };
};
exports.CustomLength = CustomLength;
/**
 * Validator constraint for custom length validation.
 */
let CustomLengthConstraint = class CustomLengthConstraint {
    /**
     * Validates the length of the provided value.
     * @param value - The value to be validated.
     * @param args - Validation arguments containing constraints.
     * @returns {boolean} - True if the length is within the specified constraints, otherwise false.
     */
    validate(value, args) {
        if (!value)
            return true;
        return length(value, args.constraints[0]);
    }
    /**
     * Returns the default error message for the custom length validation.
     * @param validationArguments - Validation arguments containing the value.
     * @returns {string} - Default error message.
     */
    defaultMessage(validationArguments) {
        const { value } = validationArguments;
        return `(${value}) is too short or too long!`;
    }
};
exports.CustomLengthConstraint = CustomLengthConstraint;
exports.CustomLengthConstraint = CustomLengthConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: "CustomLength", async: false })
], CustomLengthConstraint);
//# sourceMappingURL=custom-length.decorator.js.map