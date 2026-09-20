/**
 * Mixins create partial classes that can be combined to form a single class containing all methods and properties
 * from the partial classes.
 *
 * @param derivedCtor - The target class constructor to which the mixins will be applied.
 * @param constructors - An array of mixin class constructors to be applied to the target class.
 * @returns {void}
 */
export declare function applyMixins(derivedCtor: any, constructors: any[]): void;
