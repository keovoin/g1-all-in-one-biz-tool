"use strict";
/**
 * Make.com API response and request interfaces.
 *
 * These model the Make.com REST API v2 resources that Gauzy interacts with.
 * @see https://developers.make.com/api-documentation/api-reference
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAKE_COM_ZONES = void 0;
exports.getMakeApiBaseUrl = getMakeApiBaseUrl;
exports.MAKE_COM_ZONES = ['eu1', 'eu2', 'us1', 'us2'];
/**
 * Builds the Make.com API base URL for a given zone.
 */
function getMakeApiBaseUrl(zone) {
    return `https://${zone}.make.com/api/v2`;
}
//# sourceMappingURL=make-com-api.model.js.map