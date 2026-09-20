"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const events_1 = require("../../../event-bus/events");
const event_bus_1 = require("../../../event-bus/event-bus");
const base_entity_event_1 = require("../../../event-bus/base-entity-event");
const context_1 = require("../../../core/context");
const task_service_1 = require("../../task.service");
const task_update_command_1 = require("../task-update.command");
let TaskUpdateHandler = class TaskUpdateHandler {
    constructor(_eventBus, _taskService) {
        this._eventBus = _eventBus;
        this._taskService = _taskService;
        this.logger = new common_1.Logger('TaskUpdateHandler');
    }
    /**
     * Executes the TaskUpdateCommand.
     *
     * @param command - The command containing the task ID, update data, and a flag indicating whether to trigger an event.
     * @returns The updated task.
     */
    async execute(command) {
        // Destructure the command object to get the task ID, input data, and the triggered event flag
        const { id, input, triggeredEvent } = command;
        // Call the update method with the extracted parameters and return the updated task
        return await this.update(id, input, triggeredEvent);
    }
    /**
     * Update task, if already exist
     *
     * @param id - The ID of the task to update
     * @param input - The data to update the task with
     * @param triggeredEvent - Flag to indicate if an event should be triggered
     * @returns The updated task
     */
    async update(id, input, triggeredEvent) {
        try {
            // Update the task with the provided data
            const updatedTask = await this._taskService.update(id, input);
            // The "2 Way Sync Triggered Event" for Synchronization
            if (triggeredEvent) {
                // Publish the task created event
                const ctx = context_1.RequestContext.currentRequestContext(); // Get current request context;
                const event = new events_1.TaskEvent(ctx, updatedTask, base_entity_event_1.BaseEntityEventTypeEnum.UPDATED, input);
                this._eventBus.publish(event); // Publish the event using EventBus
            }
            return updatedTask;
        }
        catch (error) {
            this.logger.error(`Error while updating task: ${error.message}`, error.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TaskUpdateHandler = TaskUpdateHandler;
exports.TaskUpdateHandler = TaskUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(task_update_command_1.TaskUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [event_bus_1.EventBus, task_service_1.TaskService])
], TaskUpdateHandler);
//# sourceMappingURL=task-update.handler.js.map