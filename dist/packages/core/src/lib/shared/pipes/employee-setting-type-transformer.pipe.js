"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSettingTypeTransformerPipe = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * EmployeeSettingTypeTransformerPipe handles the conversion between the enum string values
 * (used in the application) and the integer values (stored in the database).
 */
class EmployeeSettingTypeTransformerPipe {
    /**
     * Converts the enum string value to its integer representation when writing to the database.
     *
     * @param value - The `EmployeeSettingTypeEnum` value ('Normal', 'Task-View', 'Custom').
     * @returns The corresponding integer value to be stored in the database.
     */
    to(value) {
        switch (value) {
            case contracts_1.EmployeeSettingTypeEnum.TASK_VIEWS:
                return 1;
            case contracts_1.EmployeeSettingTypeEnum.CUSTOM:
                return 2;
            default:
                return 0; // Default is NORMAL
        }
    }
    /**
     * Converts the integer value to its corresponding `EmployeeSettingTypeEnum` string when reading from the database.
     *
     * @param value - The integer value (0, 1, or 2) from the database.
     * @returns The corresponding `EmployeeSettingTypeEnum` ('Normal', 'Task-View', 'Custom').
     */
    from(value) {
        switch (value) {
            case 1:
                return contracts_1.EmployeeSettingTypeEnum.TASK_VIEWS;
            case 2:
                return contracts_1.EmployeeSettingTypeEnum.CUSTOM;
            default:
                return contracts_1.EmployeeSettingTypeEnum.NORMAL;
        }
    }
}
exports.EmployeeSettingTypeTransformerPipe = EmployeeSettingTypeTransformerPipe;
//# sourceMappingURL=employee-setting-type-transformer.pipe.js.map