"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const create_video_handler_1 = require("./create-video.handler");
const delete_video_handler_1 = require("./delete-video.handler");
const update_video_handler_1 = require("./update-video.handler");
exports.CommandHandlers = [create_video_handler_1.CreateVideoHandler, delete_video_handler_1.DeleteVideoHandler, update_video_handler_1.UpdateVideoHandler];
//# sourceMappingURL=index.js.map