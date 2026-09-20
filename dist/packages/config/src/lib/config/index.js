"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const facebook_1 = require("./facebook");
const github_1 = require("./github");
const google_1 = require("./google");
const keycloak_1 = require("./keycloak");
const linkedin_1 = require("./linkedin");
const mcp_1 = require("./mcp");
const microsoft_1 = require("./microsoft");
const setting_1 = require("./setting");
const twitter_1 = require("./twitter");
const jira_1 = require("./jira");
const zapier_1 = require("./zapier");
/**
 * This array contains individual configuration modules for different social login providers.
 */
exports.default = [app_1.default, facebook_1.default, github_1.default, google_1.default, keycloak_1.default, linkedin_1.default, mcp_1.default, microsoft_1.default, setting_1.default, twitter_1.default, jira_1.default, zapier_1.default];
//# sourceMappingURL=index.js.map