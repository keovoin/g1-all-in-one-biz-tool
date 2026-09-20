"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeSettingName = void 0;
// Define Make.com integration setting names
var MakeSettingName;
(function (MakeSettingName) {
    MakeSettingName["IS_ENABLED"] = "make_webhook_enabled";
    MakeSettingName["WEBHOOK_URL"] = "make_webhook_url";
    MakeSettingName["ACCESS_TOKEN"] = "access_token";
    MakeSettingName["REFRESH_TOKEN"] = "refresh_token";
    MakeSettingName["EXPIRES_IN"] = "expires_in";
    MakeSettingName["EXPIRES_AT"] = "expires_at";
    MakeSettingName["TOKEN_TYPE"] = "token_type";
    MakeSettingName["CLIENT_ID"] = "client_id";
    MakeSettingName["CLIENT_SECRET"] = "client_secret";
    MakeSettingName["AUTH_CODE"] = "auth_code";
    /** The Make.com zone for API calls, e.g. "us2", "eu1" */
    MakeSettingName["ZONE"] = "make_zone";
    /** The Make.com organization ID (their side, not Gauzy) */
    MakeSettingName["MAKE_ORGANIZATION_ID"] = "make_organization_id";
    /** The Make.com team ID (their side, not Gauzy) */
    MakeSettingName["MAKE_TEAM_ID"] = "make_team_id";
})(MakeSettingName || (exports.MakeSettingName = MakeSettingName = {}));
//# sourceMappingURL=make-com.model.js.map