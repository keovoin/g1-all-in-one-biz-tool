"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivepiecesSettingName = exports.ActivepiecesConnectionStatus = exports.ActivepiecesConnectionScope = exports.ActivepiecesConnectionType = void 0;
/**
 * ActivePieces connection types according to their API
 */
var ActivepiecesConnectionType;
(function (ActivepiecesConnectionType) {
    ActivepiecesConnectionType["SECRET_TEXT"] = "SECRET_TEXT";
    ActivepiecesConnectionType["OAUTH2"] = "OAUTH2";
    ActivepiecesConnectionType["CLOUD_OAUTH2"] = "CLOUD_OAUTH2";
    ActivepiecesConnectionType["PLATFORM_OAUTH2"] = "PLATFORM_OAUTH2";
    ActivepiecesConnectionType["BASIC_AUTH"] = "BASIC_AUTH";
    ActivepiecesConnectionType["CUSTOM_AUTH"] = "CUSTOM_AUTH";
})(ActivepiecesConnectionType || (exports.ActivepiecesConnectionType = ActivepiecesConnectionType = {}));
/**
 * ActivePieces connection scope
 */
var ActivepiecesConnectionScope;
(function (ActivepiecesConnectionScope) {
    ActivepiecesConnectionScope["PROJECT"] = "PROJECT";
})(ActivepiecesConnectionScope || (exports.ActivepiecesConnectionScope = ActivepiecesConnectionScope = {}));
/**
 * ActivePieces connection status
 */
var ActivepiecesConnectionStatus;
(function (ActivepiecesConnectionStatus) {
    ActivepiecesConnectionStatus["ACTIVE"] = "ACTIVE";
    ActivepiecesConnectionStatus["ERROR"] = "ERROR";
})(ActivepiecesConnectionStatus || (exports.ActivepiecesConnectionStatus = ActivepiecesConnectionStatus = {}));
/**
 * ActivePieces setting names for database storage
 */
var ActivepiecesSettingName;
(function (ActivepiecesSettingName) {
    ActivepiecesSettingName["API_KEY"] = "api_key";
    ActivepiecesSettingName["ACCESS_TOKEN"] = "access_token";
    ActivepiecesSettingName["REFRESH_TOKEN"] = "refresh_token";
    ActivepiecesSettingName["TOKEN_TYPE"] = "token_type";
    ActivepiecesSettingName["EXPIRES_IN"] = "expires_in";
    ActivepiecesSettingName["EXPIRES_AT"] = "expires_at";
    ActivepiecesSettingName["CONNECTION_ID"] = "connection_id";
    ActivepiecesSettingName["PROJECT_ID"] = "project_id";
    ActivepiecesSettingName["IS_ENABLED"] = "is_enabled";
    ActivepiecesSettingName["CLIENT_ID"] = "client_id";
    ActivepiecesSettingName["CLIENT_SECRET"] = "client_secret";
    ActivepiecesSettingName["CALLBACK_URL"] = "callback_url";
    ActivepiecesSettingName["POST_INSTALL_URL"] = "post_install_url";
    ActivepiecesSettingName["STATE_SECRET"] = "state_secret";
})(ActivepiecesSettingName || (exports.ActivepiecesSettingName = ActivepiecesSettingName = {}));
//# sourceMappingURL=activepieces-integration-config.model.js.map