"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationDeleteHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const cqrs_2 = require("@nestjs/cqrs");
const __1 = require("..");
const task_estimation_service_1 = require("../../task-estimation.service");
const task_estimation_delete_command_1 = require("../task-estimation-delete.command");
let TaskEstimationDeleteHandler = class TaskEstimationDeleteHandler {
    constructor(_taskEstimationService, commandBus) {
        this._taskEstimationService = _taskEstimationService;
        this.commandBus = commandBus;
    }
    async execute(command) {
        const { id } = command;
        return await this.delete(id);
    }
    /**
     * Delete task estimation, if already exist
     *
     * @param id
     * @returns
     */
    async delete(id) {
        try {
            const taskEstimation = await this._taskEstimationService.findOneByIdString(id);
            const deleteResponse = await this._taskEstimationService.delete(id);
            await this.commandBus.execute(new __1.TaskEstimationCalculateCommand(taskEstimation.taskId));
            return deleteResponse;
        }
        catch (error) {
            console.log('Error while deleting task estimation', error?.message);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.TaskEstimationDeleteHandler = TaskEstimationDeleteHandler;
exports.TaskEstimationDeleteHandler = TaskEstimationDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_estimation_delete_command_1.TaskEstimationDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [task_estimation_service_1.TaskEstimationService,
        cqrs_2.CommandBus])
], TaskEstimationDeleteHandler);
//# sourceMappingURL=task-estimation-delete.handler.js.map