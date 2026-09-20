"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVideoQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const videos_service_1 = require("../../services/videos.service");
const get_video_query_1 = require("../get-video.query");
let GetVideoQueryHandler = class GetVideoQueryHandler {
    constructor(videosService) {
        this.videosService = videosService;
    }
    /**
     * Handles the `GetVideoQuery` to retrieve a video entity by its ID.
     *
     * @param query - The `GetVideoQuery` containing the ID of the video to be fetched and optional query options.
     *
     * @returns A promise resolving to the video entity (`IVideo`) if found.
     *
     * @throws {NotFoundException} If the video with the specified ID is not found.
     */
    async execute(query) {
        // Destructure the query to extract the video ID and options
        const { id, options = {} } = query;
        // Step 1: Fetch the video entity from the database
        const video = await this.videosService.findOneByIdString(id, options);
        // Step 2: Throw a NotFoundException if the video does not exist
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID ${id} not found.`);
        }
        // Step 3: Return the video entity
        return video;
    }
};
exports.GetVideoQueryHandler = GetVideoQueryHandler;
exports.GetVideoQueryHandler = GetVideoQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_video_query_1.GetVideoQuery),
    tslib_1.__metadata("design:paramtypes", [videos_service_1.VideosService])
], GetVideoQueryHandler);
//# sourceMappingURL=get-video.handler.js.map