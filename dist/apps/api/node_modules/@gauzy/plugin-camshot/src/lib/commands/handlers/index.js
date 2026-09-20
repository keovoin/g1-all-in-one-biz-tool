"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandHandlers = void 0;
const create_camshot_command_handler_1 = require("./create-camshot-command.handler");
const delete_camshot_command_handler_1 = require("./delete-camshot-command.handler");
const recover_camshot_command_handler_1 = require("./recover-camshot-command.handler");
exports.commandHandlers = [create_camshot_command_handler_1.CreateCamshotCommandHandler, delete_camshot_command_handler_1.DeleteCamshotCommandHandler, recover_camshot_command_handler_1.RecoverCamshotCommandHandler];
//# sourceMappingURL=index.js.map