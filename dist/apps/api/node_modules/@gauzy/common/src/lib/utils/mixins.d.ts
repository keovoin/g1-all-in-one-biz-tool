/**
 * Mixins create partial classes which we can combine to form a single class that contains all the methods and properties from the partial classes.
 *
 * @param derivedCtor - The target class constructor to which mixins will be applied.
 * @param constructors - An array of mixin class constructors to be applied to the target class.
 * @returns {void}
 */
export declare function applyMixins(derivedCtor: any, constructors: any[]): void;
