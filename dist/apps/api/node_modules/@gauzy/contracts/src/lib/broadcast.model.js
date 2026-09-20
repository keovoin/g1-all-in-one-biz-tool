"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastVisibilityModeEnum = exports.BroadcastCategoryEnum = void 0;
/**
 * Broadcast category enum
 * Defines the type of broadcast content
 */
var BroadcastCategoryEnum;
(function (BroadcastCategoryEnum) {
    BroadcastCategoryEnum["STATUS_REPORT"] = "STATUS_REPORT";
    BroadcastCategoryEnum["MILESTONE"] = "MILESTONE";
    BroadcastCategoryEnum["ANNOUNCEMENT"] = "ANNOUNCEMENT";
    BroadcastCategoryEnum["ALERT"] = "ALERT";
    BroadcastCategoryEnum["DECISION"] = "DECISION";
    BroadcastCategoryEnum["CHANGELOG"] = "CHANGELOG"; // Change log or release notes
})(BroadcastCategoryEnum || (exports.BroadcastCategoryEnum = BroadcastCategoryEnum = {}));
/**
 * Broadcast visibility mode enum
 * Defines who can see the broadcast
 */
var BroadcastVisibilityModeEnum;
(function (BroadcastVisibilityModeEnum) {
    BroadcastVisibilityModeEnum["ENTITY_MEMBERS"] = "ENTITY_MEMBERS";
    BroadcastVisibilityModeEnum["ORGANIZATION"] = "ORGANIZATION";
    BroadcastVisibilityModeEnum["RESTRICTED"] = "RESTRICTED";
    BroadcastVisibilityModeEnum["EXTERNAL_VIEW"] = "EXTERNAL_VIEW"; // Via shared read-only link (public share)
})(BroadcastVisibilityModeEnum || (exports.BroadcastVisibilityModeEnum = BroadcastVisibilityModeEnum = {}));
//# sourceMappingURL=broadcast.model.js.map