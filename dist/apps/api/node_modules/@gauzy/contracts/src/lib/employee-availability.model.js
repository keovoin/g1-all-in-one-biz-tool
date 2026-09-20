"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityStatusMap = exports.AvailabilityStatusValue = exports.AvailabilityStatusEnum = void 0;
/**
 * Enum representing different availability statuses.
 */
var AvailabilityStatusEnum;
(function (AvailabilityStatusEnum) {
    AvailabilityStatusEnum["Available"] = "Available";
    AvailabilityStatusEnum["Partial"] = "Partial";
    AvailabilityStatusEnum["Unavailable"] = "Unavailable";
})(AvailabilityStatusEnum || (exports.AvailabilityStatusEnum = AvailabilityStatusEnum = {}));
/**
 * Enum mapping availability statuses to numerical values.
 */
var AvailabilityStatusValue;
(function (AvailabilityStatusValue) {
    AvailabilityStatusValue[AvailabilityStatusValue["Available"] = 0] = "Available";
    AvailabilityStatusValue[AvailabilityStatusValue["Partial"] = 1] = "Partial";
    AvailabilityStatusValue[AvailabilityStatusValue["Unavailable"] = 2] = "Unavailable";
})(AvailabilityStatusValue || (exports.AvailabilityStatusValue = AvailabilityStatusValue = {}));
/**
 * A mapping object to relate status labels to their respective numerical values.
 */
exports.AvailabilityStatusMap = {
    [AvailabilityStatusEnum.Available]: AvailabilityStatusValue.Available,
    [AvailabilityStatusEnum.Partial]: AvailabilityStatusValue.Partial,
    [AvailabilityStatusEnum.Unavailable]: AvailabilityStatusValue.Unavailable
};
//# sourceMappingURL=employee-availability.model.js.map