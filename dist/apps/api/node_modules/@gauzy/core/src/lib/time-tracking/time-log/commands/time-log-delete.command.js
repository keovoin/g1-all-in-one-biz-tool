"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogDeleteCommand = void 0;
class TimeLogDeleteCommand {
    constructor(ids, forceDelete = false) {
        this.ids = ids;
        this.forceDelete = forceDelete;
    }
}
exports.TimeLogDeleteCommand = TimeLogDeleteCommand;
TimeLogDeleteCommand.type = '[TimeLog] delete';
//# sourceMappingURL=time-log-delete.command.js.map