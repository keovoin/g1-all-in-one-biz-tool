import { Request } from 'express';
export interface SecurityEvent {
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    ip: string;
    userAgent?: string;
    sessionId?: string;
    userId?: string;
    details: Record<string, unknown>;
    timestamp: Date;
}
export declare class SecurityLogger {
    private static events;
    private static readonly MAX_EVENTS;
    static logSecurityEvent(event: string, severity: SecurityEvent['severity'], details: Record<string, unknown>, req?: Request): void;
    static getRecentEvents(limit?: number): SecurityEvent[];
    static getEventsByIP(ip: string, hours?: number): SecurityEvent[];
    private static sendToExternalMonitoring;
    private static safeStringify;
    debug(message: string, data?: Record<string, unknown>): void;
    log(message: string, data?: Record<string, unknown>): void;
    warn(message: string, data?: Record<string, unknown>): void;
    error(message: string, error?: Error | Record<string, unknown>): void;
    info(message: string, data?: Record<string, unknown>): void;
    logSecurityEvent(event: string, severity: SecurityEvent['severity'], details: Record<string, unknown>, req?: Request): void;
}
export declare const SecurityEvents: {
    readonly INVALID_AUTH: "invalid_authentication";
    readonly BRUTE_FORCE: "brute_force_attempt";
    readonly SUSPICIOUS_PAYLOAD: "suspicious_payload";
    readonly RATE_LIMIT_EXCEEDED: "rate_limit_exceeded";
    readonly INVALID_SESSION: "invalid_session";
    readonly CSRF_VIOLATION: "csrf_violation";
    readonly TOOL_VALIDATION_FAILED: "tool_validation_failed";
    readonly LARGE_REQUEST: "large_request_blocked";
    readonly UNAUTHORIZED_ORIGIN: "unauthorized_origin";
    readonly SUSPICIOUS_USER_AGENT: "suspicious_user_agent";
};
