"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeNotificationTypeTransformer = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * EmployeeNotificationTypeTransformer handles the conversion between the enum string values
 * (used in the application) and the integer values (stored in the database).
 */
class EmployeeNotificationTypeTransformer {
    /**
     * Converts the enum string value to its integer representation when writing to the database.
     *
     * @param value - The `EmployeeNotificationTypeEnum` value.
     * @returns The corresponding integer value to be stored in the database.
     */
    to(value) {
        switch (value) {
            case contracts_1.EmployeeNotificationTypeEnum.PAYMENT:
                return 0;
            case contracts_1.EmployeeNotificationTypeEnum.ASSIGNMENT:
                return 1;
            case contracts_1.EmployeeNotificationTypeEnum.INVITATION:
                return 2;
            case contracts_1.EmployeeNotificationTypeEnum.MENTION:
                return 3;
            case contracts_1.EmployeeNotificationTypeEnum.COMMENT:
                return 4;
            case contracts_1.EmployeeNotificationTypeEnum.MESSAGE:
                return 5;
            case contracts_1.EmployeeNotificationTypeEnum.BROADCAST:
                return 6;
            default:
                throw new Error(`Unsupported notification type: ${value}`);
        }
    }
    /**
     * Converts the integer value to its corresponding `EmployeeNotificationTypeEnum` string when reading from the database.
     *
     * @param value - The integer value from the database.
     * @returns The corresponding `EmployeeNotificationTypeEnum`.
     */
    from(value) {
        switch (value) {
            case 0:
                return contracts_1.EmployeeNotificationTypeEnum.PAYMENT;
            case 1:
                return contracts_1.EmployeeNotificationTypeEnum.ASSIGNMENT;
            case 2:
                return contracts_1.EmployeeNotificationTypeEnum.INVITATION;
            case 3:
                return contracts_1.EmployeeNotificationTypeEnum.MENTION;
            case 4:
                return contracts_1.EmployeeNotificationTypeEnum.COMMENT;
            case 5:
                return contracts_1.EmployeeNotificationTypeEnum.MESSAGE;
            case 6:
                return contracts_1.EmployeeNotificationTypeEnum.BROADCAST;
            default:
                throw new Error(`Unknown notification type value: ${value}`);
        }
    }
}
exports.EmployeeNotificationTypeTransformer = EmployeeNotificationTypeTransformer;
//# sourceMappingURL=employee-notification-type-transform.js.map