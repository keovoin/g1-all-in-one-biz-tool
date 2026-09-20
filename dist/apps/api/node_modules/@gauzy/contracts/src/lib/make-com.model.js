"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAKE_COM_ZONES = exports.MakeSettingName = void 0;
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
})(MakeSettingName || (exports.MakeSettingName = MakeSettingName = {}));
exports.MAKE_COM_ZONES = ['eu1', 'eu2', 'us1', 'us2'];
//# sourceMappingURL=make-com.model.js.map