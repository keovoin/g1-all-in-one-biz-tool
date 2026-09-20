export declare class SanitizerUtil {
    private static readonly sensitiveFields;
    private static readonly sensitiveHeaders;
    static sanitizeHeaders(headers: Record<string, any>): Record<string, any>;
    static sanitizeObject(obj: any): any;
}
