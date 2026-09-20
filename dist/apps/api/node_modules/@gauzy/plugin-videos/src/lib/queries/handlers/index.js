"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandlers = void 0;
const get_video_count_handler_1 = require("./get-video-count.handler");
const get_video_handler_1 = require("./get-video.handler");
const get_videos_handler_1 = require("./get-videos.handler");
exports.QueryHandlers = [get_video_handler_1.GetVideoQueryHandler, get_videos_handler_1.GetVideosQueryHandler, get_video_count_handler_1.GetVideoCountQueryHandler];
//# sourceMappingURL=index.js.map