"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityEvents = exports.SecurityLogger = void 0;
const common_1 = require("@nestjs/common");
const security_utils_1 = require("./security-utils");
const node_util_1 = require("node:util");
// Use environment variables directly
const isProduction = process.env.NODE_ENV === 'production';
const logger = new common_1.Logger('SecurityLogger');
class SecurityLogger {
    static logSecurityEvent(event, severity, details, req) {
        const securityEvent = {
            event,
            severity,
            ip: req?.ip || 'unknown',
            userAgent: req?.get('User-Agent'),
            sessionId: req?.sessionID ||
                req?.session?.id ||
                req?.headers?.['x-session-id'] ||
                undefined,
            userId: req?.user?.id ||
                req?.userContext?.userId ||
                undefined,
            details: (0, security_utils_1.sanitizeForLogging)(details),
            timestamp: new Date()
        };
        // Add to in-memory store (with rotation)
        this.events.push(securityEvent);
        if (this.events.length > this.MAX_EVENTS) {
            this.events = this.events.slice(-this.MAX_EVENTS);
        }
        // Log based on severity
        const message = `Security Event: ${event} (${severity}) from ${securityEvent.ip}`;
        const payload = SecurityLogger.safeStringify(securityEvent);
        switch (severity) {
            case 'critical':
                logger.error(message, payload);
                break;
            case 'high':
                logger.warn(message, payload);
                break;
            default:
                logger.log(message, payload);
        }
        // In production, send to external monitoring
        if (isProduction && ['high', 'critical'].includes(severity)) {
            this.sendToExternalMonitoring(securityEvent);
        }
    }
    static getRecentEvents(limit = 100) {
        return this.events.slice(-limit);
    }
    static getEventsByIP(ip, hours = 24) {
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        return this.events.filter(e => e.ip === ip && e.timestamp > cutoff);
    }
    static sendToExternalMonitoring(event) {
        // Placeholder for external monitoring integration
        // e.g., Splunk, ELK, Datadog, etc.
        logger.debug(`Would send to external monitoring: ${event.event}`);
    }
    static safeStringify(obj) {
        if (!obj)
            return '';
        try {
            const seen = new WeakSet();
            return JSON.stringify((0, security_utils_1.sanitizeForLogging)(obj), (_k, v) => {
                if (typeof v === 'object' && v !== null) {
                    if (seen.has(v))
                        return '[Circular]';
                    seen.add(v);
                }
                return v;
            });
        }
        catch {
            try {
                return (0, node_util_1.inspect)(obj, { depth: 3, breakLength: 120 });
            }
            catch {
                return '[Unserializable]';
            }
        }
    }
    // Instance methods for easier usage in middleware
    debug(message, data) {
        if (!isProduction || process.env.GAUZY_MCP_DEBUG === 'true') {
            logger.debug(message, SecurityLogger.safeStringify(data));
        }
    }
    log(message, data) {
        logger.log(message, SecurityLogger.safeStringify(data));
    }
    warn(message, data) {
        logger.warn(message, SecurityLogger.safeStringify(data));
    }
    error(message, error) {
        if (error instanceof Error) {
            logger.error(message, error.stack || error.message);
        }
        else if (error) {
            logger.error(message, SecurityLogger.safeStringify(error));
        }
        else {
            logger.error(message);
        }
    }
    info(message, data) {
        logger.log(message, SecurityLogger.safeStringify(data));
    }
    // Instance method to log security events with request context
    logSecurityEvent(event, severity, details, req) {
        SecurityLogger.logSecurityEvent(event, severity, details, req);
    }
}
exports.SecurityLogger = SecurityLogger;
SecurityLogger.events = [];
SecurityLogger.MAX_EVENTS = 1000;
// Pre-defined security events
exports.SecurityEvents = {
    INVALID_AUTH: 'invalid_authentication',
    BRUTE_FORCE: 'brute_force_attempt',
    SUSPICIOUS_PAYLOAD: 'suspicious_payload',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
    INVALID_SESSION: 'invalid_session',
    CSRF_VIOLATION: 'csrf_violation',
    TOOL_VALIDATION_FAILED: 'tool_validation_failed',
    LARGE_REQUEST: 'large_request_blocked',
    UNAUTHORIZED_ORIGIN: 'unauthorized_origin',
    SUSPICIOUS_USER_AGENT: 'suspicious_user_agent'
};
//# sourceMappingURL=security-logger.js.map