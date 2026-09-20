"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPUtils = void 0;
const nodemailer = require("nodemailer");
const config_1 = require("@gauzy/config");
/**
 * Email utils functions.
 */
class SMTPUtils {
    /** Normalize secure flag by port and explicit configuration */
    static normalizeSecure(port, secure) {
        const p = port ?? 587;
        if (p === 465)
            return true; // implicit TLS
        if (p === 587)
            return false; // always STARTTLS on submission port
        return !!secure; // other ports: respect provided value
    }
    /**
     * Returns the default SMTP transporter configuration based on the environment.
     * @param auth Whether to include the authentication details in the configuration.
     * @returns An SMTP configuration object.
     */
    static defaultSMTPTransporter(auth = true) {
        const smtpConfig = config_1.environment.smtpConfig; // Assuming environment.smtpConfig holds your SMTP configuration
        const smtp = {
            fromAddress: smtpConfig.fromAddress,
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure
        };
        if (auth) {
            smtp.auth = {
                user: smtpConfig.auth.user,
                pass: smtpConfig.auth.pass
            };
        }
        // Construct and return the SMTP configuration object
        return smtp;
    }
    /**
     * Verifies the configuration of an SMTP transporter.
     * @param config The configuration object for the SMTP transporter.
     * @returns A Promise that resolves to true if the configuration is valid, or false if there's an error.
     */
    static async verifyTransporter(config) {
        try {
            const port = config.port || 587;
            // Port 465 => implicit TLS; otherwise respect provided secure value
            const secure = SMTPUtils.normalizeSecure(port, config.secure);
            const transporter = nodemailer.createTransport({
                from: config.fromAddress,
                host: config.host,
                port,
                secure,
                requireTLS: port === 587 ? true : undefined,
                tls: port === 587 && !secure ? { servername: config.host } : undefined,
                auth: {
                    user: config.username,
                    pass: config.password
                }
            });
            // Verify the transporter
            return await transporter.verify(); // Configuration is valid / invalid;
        }
        catch (error) {
            console.log('Error while verifying nodemailer transport: %s', error?.message);
            return false;
        }
    }
    /**
     *
     * @param config
     */
    static convertSmtpToTransporter(config) {
        /** */
        const normalizedPort = config?.port ?? 587;
        // Normalize secure flag using helper (465 => true, otherwise respect provided secure)
        const normalizedSecure = SMTPUtils.normalizeSecure(normalizedPort, config?.secure);
        const transport = {
            host: config?.host,
            port: normalizedPort,
            secure: normalizedSecure,
            username: config?.auth.user,
            password: config?.auth.pass,
            fromAddress: config?.fromAddress
        };
        // console.log('SMTP config to transporter configuration: %s', transport);
        return transport;
    }
    /** Build Nodemailer transport options from ISMTPConfig with proper STARTTLS/TLS semantics */
    static buildTransportFromSMTPConfig(config) {
        const port = config?.port ?? 587;
        let secure = SMTPUtils.normalizeSecure(port, config?.secure);
        if (port === 587 && secure === true) {
            secure = false; // enforce STARTTLS on 587
        }
        return {
            ...config,
            port,
            secure,
            requireTLS: port === 587 ? true : undefined,
            tls: port === 587 && secure === false ? { servername: config.host } : undefined
        };
    }
}
exports.SMTPUtils = SMTPUtils;
//# sourceMappingURL=utils.js.map