"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMixins = applyMixins;
/**
 * Mixins create partial classes which we can combine to form a single class that contains all the methods and properties from the partial classes.
 *
 * @param derivedCtor - The target class constructor to which mixins will be applied.
 * @param constructors - An array of mixin class constructors to be applied to the target class.
 * @returns {void}
 */
function applyMixins(derivedCtor, constructors) {
    // Iterate through each mixin constructor
    constructors.forEach((baseCtor) => {
        // Iterate through each property/method of the mixin
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            // Copy the property/method from the mixin to the target class prototype
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
        });
    });
}
//# sourceMappingURL=mixins.js.map