"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const changelog_create_handler_1 = require("./changelog.create.handler");
const changelog_update_handler_1 = require("./changelog.update.handler");
exports.CommandHandlers = [
    changelog_create_handler_1.ChangelogCreateHandler,
    changelog_update_handler_1.ChangelogUpdateHandler
];
//# sourceMappingURL=index.js.map