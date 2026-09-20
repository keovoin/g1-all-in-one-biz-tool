"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register Jira configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('jira', () => ({
    appName: process.env.GAUZY_JIRA_APP_NAME,
    appDescription: process.env.GAUZY_JIRA_APP_DESCRIPTION,
    appKey: process.env.GAUZY_JIRA_APP_KEY,
    baseUrl: process.env.GAUZY_JIRA_APP_BASE_URL,
    vendorName: process.env.GAUZY_JIRA_APP_BASE_VENDOR_NAME,
    vendorUrl: process.env.GAUZY_JIRA_APP_BASE_VENDOR_URL
}));
//# sourceMappingURL=jira.js.map