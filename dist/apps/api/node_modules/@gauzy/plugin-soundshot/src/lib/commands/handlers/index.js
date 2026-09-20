"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandHandlers = void 0;
const create_soundshot_command_handler_1 = require("./create-soundshot-command.handler");
const delete_soundshot_command_handler_1 = require("./delete-soundshot-command.handler");
const recover_soundshot_command_handler_1 = require("./recover-soundshot-command.handler");
exports.commandHandlers = [
    create_soundshot_command_handler_1.CreateSoundshotCommandHandler,
    delete_soundshot_command_handler_1.DeleteSoundshotCommandHandler,
    recover_soundshot_command_handler_1.RecoverSoundshotCommandHandler
];
//# sourceMappingURL=index.js.map