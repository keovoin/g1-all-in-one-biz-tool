"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicPerceivedMomentumEnum = exports.OrganizationStrategicConfidenceLevelEnum = exports.OrganizationStrategicVisibilityScopeEnum = exports.OrganizationStrategicStateEnum = void 0;
/**
 * Organization Strategic State enum
 * Defines the lifecycle phase of a strategic initiative
 *
 * Lifecycle:
 * 1. DRAFT - Strategic intent is being articulated
 * 2. ACTIVE - Leadership validated, projects are being aligned
 * 3. RESOLVED - Strategy fulfilled its purpose
 * 4. RETIRED - Strategy discontinued or transformed
 */
var OrganizationStrategicStateEnum;
(function (OrganizationStrategicStateEnum) {
    OrganizationStrategicStateEnum["DRAFT"] = "draft";
    OrganizationStrategicStateEnum["ACTIVE"] = "active";
    OrganizationStrategicStateEnum["RESOLVED"] = "resolved";
    OrganizationStrategicStateEnum["RETIRED"] = "retired";
})(OrganizationStrategicStateEnum || (exports.OrganizationStrategicStateEnum = OrganizationStrategicStateEnum = {}));
/**
 * Organization Strategic Visibility scope enum
 * Defines who can see the strategic initiative
 *
 * - LEADERSHIP: Only organization admins/managers
 * - ORGANIZATION: All organization members
 * - TEAM: Members of teams linked to associated projects
 */
var OrganizationStrategicVisibilityScopeEnum;
(function (OrganizationStrategicVisibilityScopeEnum) {
    OrganizationStrategicVisibilityScopeEnum["LEADERSHIP"] = "leadership";
    OrganizationStrategicVisibilityScopeEnum["ORGANIZATION"] = "organization";
    OrganizationStrategicVisibilityScopeEnum["TEAM"] = "team";
})(OrganizationStrategicVisibilityScopeEnum || (exports.OrganizationStrategicVisibilityScopeEnum = OrganizationStrategicVisibilityScopeEnum = {}));
/**
 * Organization Strategic Confidence level enum
 * Qualitative signal for strategic confidence
 */
var OrganizationStrategicConfidenceLevelEnum;
(function (OrganizationStrategicConfidenceLevelEnum) {
    OrganizationStrategicConfidenceLevelEnum["LOW"] = "low";
    OrganizationStrategicConfidenceLevelEnum["MEDIUM"] = "medium";
    OrganizationStrategicConfidenceLevelEnum["HIGH"] = "high";
})(OrganizationStrategicConfidenceLevelEnum || (exports.OrganizationStrategicConfidenceLevelEnum = OrganizationStrategicConfidenceLevelEnum = {}));
/**
 * Organization Strategic Perceived momentum enum
 * Qualitative signal for strategic progress perception
 */
var OrganizationStrategicPerceivedMomentumEnum;
(function (OrganizationStrategicPerceivedMomentumEnum) {
    OrganizationStrategicPerceivedMomentumEnum["STALLED"] = "stalled";
    OrganizationStrategicPerceivedMomentumEnum["PROGRESSING"] = "progressing";
    OrganizationStrategicPerceivedMomentumEnum["ACCELERATING"] = "accelerating";
})(OrganizationStrategicPerceivedMomentumEnum || (exports.OrganizationStrategicPerceivedMomentumEnum = OrganizationStrategicPerceivedMomentumEnum = {}));
//# sourceMappingURL=organization-strategic-initiative.model.js.map