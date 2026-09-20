"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationActionTypeEnum = exports.EmployeeNotificationTypeEnum = void 0;
/**
 * Enum for employee notification types.
 * Values indicate the type of notification and their respective DB representations.
 */
var EmployeeNotificationTypeEnum;
(function (EmployeeNotificationTypeEnum) {
    EmployeeNotificationTypeEnum["PAYMENT"] = "Payment";
    EmployeeNotificationTypeEnum["ASSIGNMENT"] = "Assignment";
    EmployeeNotificationTypeEnum["INVITATION"] = "Invitation";
    EmployeeNotificationTypeEnum["MENTION"] = "Mention";
    EmployeeNotificationTypeEnum["COMMENT"] = "Comment";
    EmployeeNotificationTypeEnum["MESSAGE"] = "Message";
    EmployeeNotificationTypeEnum["BROADCAST"] = "Broadcast"; // Stored as 6 in DB
})(EmployeeNotificationTypeEnum || (exports.EmployeeNotificationTypeEnum = EmployeeNotificationTypeEnum = {}));
/**
 * Enum for notification actions.
 * Represents the actions that trigger notifications within the system.
 */
var NotificationActionTypeEnum;
(function (NotificationActionTypeEnum) {
    NotificationActionTypeEnum["Paid"] = "Paid";
    NotificationActionTypeEnum["Assigned"] = "Assigned";
    NotificationActionTypeEnum["Invited"] = "Invited";
    NotificationActionTypeEnum["Mentioned"] = "Mentioned";
    NotificationActionTypeEnum["Commented"] = "Commented";
    NotificationActionTypeEnum["Messaged"] = "Messaged";
    NotificationActionTypeEnum["Broadcasted"] = "Broadcasted";
})(NotificationActionTypeEnum || (exports.NotificationActionTypeEnum = NotificationActionTypeEnum = {}));
//# sourceMappingURL=employee-notification.model.js.map