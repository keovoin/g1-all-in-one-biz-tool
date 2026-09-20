"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskUpdateCommand = void 0;
class TaskUpdateCommand {
    constructor(id, input, triggeredEvent = true // Enabled the "2 Way Sync Triggered Event" Synchronization
    ) {
        this.id = id;
        this.input = input;
        this.triggeredEvent = triggeredEvent;
    }
}
exports.TaskUpdateCommand = TaskUpdateCommand;
TaskUpdateCommand.type = '[Tasks] Update Task';
//# sourceMappingURL=task-update.command.js.map