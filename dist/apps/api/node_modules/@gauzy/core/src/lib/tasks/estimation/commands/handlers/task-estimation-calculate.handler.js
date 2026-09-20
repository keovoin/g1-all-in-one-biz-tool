"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimationCalculateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const task_estimation_calculate_command_1 = require("../task-estimation-calculate.command");
const task_estimation_service_1 = require("../../task-estimation.service");
const task_service_1 = require("../../../task.service");
let TaskEstimationCalculateHandler = class TaskEstimationCalculateHandler {
    constructor(_taskEstimationService, _taskService) {
        this._taskEstimationService = _taskEstimationService;
        this._taskService = _taskService;
    }
    async execute(command) {
        try {
            const { id: taskId } = command;
            const taskEstimations = await this._taskEstimationService.findAll({
                where: {
                    taskId
                }
            });
            const totalEstimation = taskEstimations.items.reduce((sum, current) => sum + current.estimate, 0);
            const averageEstimation = Math.ceil(totalEstimation / taskEstimations.items.length);
            await this._taskService.update(taskId, {
                estimate: averageEstimation
            });
        }
        catch (error) {
            console.log('Error while creating task estimation', error?.message);
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.TaskEstimationCalculateHandler = TaskEstimationCalculateHandler;
exports.TaskEstimationCalculateHandler = TaskEstimationCalculateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_estimation_calculate_command_1.TaskEstimationCalculateCommand),
    tslib_1.__metadata("design:paramtypes", [task_estimation_service_1.TaskEstimationService,
        task_service_1.TaskService])
], TaskEstimationCalculateHandler);
//# sourceMappingURL=task-estimation-calculate.handler.js.map