"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaneSettingName = void 0;
/**
 * Setting name constants for the Plane integration.
 * These are stored as `settingsName` in the `integration_setting` table.
 */
var PlaneSettingName;
(function (PlaneSettingName) {
    /** Integration mode: 'shared' (global hosted PM UIs) or 'custom' (tenant-provided URLs) */
    PlaneSettingName["PLANE_MODE"] = "PLANE_MODE";
    /** Main Plane web app URL */
    PlaneSettingName["PLANE_WEB_URL"] = "PLANE_WEB_URL";
    /** Plane admin panel URL */
    PlaneSettingName["PLANE_ADMIN_URL"] = "PLANE_ADMIN_URL";
    /** Plane public space URL */
    PlaneSettingName["PLANE_SPACE_URL"] = "PLANE_SPACE_URL";
    /** The plain-text API key credential value (not a record ID) */
    PlaneSettingName["PLANE_API_KEY_VALUE"] = "PLANE_API_KEY_VALUE";
    /** The plain-text API secret (stored for proxy-to-Gauzy internal auth) */
    PlaneSettingName["PLANE_API_SECRET_VALUE"] = "PLANE_API_SECRET_VALUE";
    /** Whether the integration is enabled */
    PlaneSettingName["IS_ENABLED"] = "IS_ENABLED";
})(PlaneSettingName || (exports.PlaneSettingName = PlaneSettingName = {}));
//# sourceMappingURL=plane-setting.enum.js.map