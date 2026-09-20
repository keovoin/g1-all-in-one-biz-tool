"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const cqrs_2 = require("@nestjs/cqrs");
const task_estimation_service_1 = require("../../task-estimation.service");
const task_estimation_update_command_1 = require("../task-estimation-update.command");
const task_estimation_calculate_command_1 = require("./../task-estimation-calculate.command");
let TaskEstimationUpdateHandler = class TaskEstimationUpdateHandler {
    constructor(_taskEstimationService, commandBus) {
        this._taskEstimationService = _taskEstimationService;
        this.commandBus = commandBus;
    }
    async execute(command) {
        const { id, input } = command;
        return await this.update(id, input);
    }
    /**
     * Update task, if already exist
     *
     * @param id
     * @param request
     * @returns
     */
    async update(id, request) {
        try {
            const taskEstimation = await this._taskEstimationService.findOneByIdString(id);
            await this._taskEstimationService.update(id, {
                ...request,
                id,
            });
            await this.commandBus.execute(new task_estimation_calculate_command_1.TaskEstimationCalculateCommand(taskEstimation.taskId));
            return await this._taskEstimationService.create({
                ...request,
                id,
            });
        }
        catch (error) {
            console.log('Error while updating task estimation', error?.message);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.TaskEstimationUpdateHandler = TaskEstimationUpdateHandler;
exports.TaskEstimationUpdateHandler = TaskEstimationUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_estimation_update_command_1.TaskEstimationUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [task_estimation_service_1.TaskEstimationService,
        cqrs_2.CommandBus])
], TaskEstimationUpdateHandler);
//# sourceMappingURL=task-estimation-update.handler.js.map