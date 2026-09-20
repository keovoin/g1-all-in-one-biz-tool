/**
 * Create a named unique token for dependency injection.
 * The returned value is a `symbol` but carries a tiny phantom type
 * so consumers get better autocomplete/intent while remaining a runtime
 * unique symbol.
 */
export declare function createToken<Name extends string>(name: Name): symbol & {
    readonly __token?: Name;
};
