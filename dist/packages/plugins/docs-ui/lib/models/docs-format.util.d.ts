/**
 * Byte formatter shared by the upload toasts, the drop strip and the stats tiles
 * (same rounding as the detail panel). Falsy input renders as an em-dash — the
 * callers use `0` to mean "unknown", never "zero bytes".
 */
export declare function humanizeBytes(bytes: number): string;
