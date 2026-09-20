"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const employee_bulk_create_command_1 = require("../employee.bulk.create.command");
const employee_create_command_1 = require("../employee.create.command");
let EmployeeBulkCreateHandler = class EmployeeBulkCreateHandler {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    /**
     * Executes a bulk create operation for employees.
     * @param command The bulk create command containing input, language code, and origin URL.
     * @returns A promise that resolves to an array of created employees.
     */
    async execute(command) {
        try {
            const { input, languageCode, originUrl } = command;
            // Initialize an empty array to store the results
            const results = [];
            // Sequentially process each entity and execute the respective command
            for (const entity of input) {
                // Execute the create command for the current entity
                const result = await this.commandBus.execute(new employee_create_command_1.EmployeeCreateCommand(entity, languageCode, originUrl));
                results.push(result);
            }
            return results;
        }
        catch (error) {
            // Return a more descriptive error message for bulk create failure
            throw new common_1.BadRequestException(error.message || 'Failed to create multiple employees');
        }
    }
};
exports.EmployeeBulkCreateHandler = EmployeeBulkCreateHandler;
exports.EmployeeBulkCreateHandler = EmployeeBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_bulk_create_command_1.EmployeeBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], EmployeeBulkCreateHandler);
//# sourceMappingURL=employee.bulk.create.handler.js.map