"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteVideoHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const videos_service_1 = require("../../services/videos.service");
const delete_video_command_1 = require("../delete-video.command");
let DeleteVideoHandler = class DeleteVideoHandler {
    constructor(videosService) {
        this.videosService = videosService;
    }
    /**
     * Handles the `DeleteVideoCommand` to delete a video entity from the database.
     * Validates the existence of the video and performs the deletion based on the provided criteria.
     *
     * @param command - The `DeleteVideoCommand` containing the video ID and additional options for deletion.
     *
     * @returns A promise resolving to a `DeleteResult`, which includes metadata about the deletion operation.
     *
     * @throws {NotFoundException} If the video with the specified ID does not exist.
     */
    async execute(command) {
        // Destructure the command to extract input data
        const { input: { id, options = {} } } = command;
        // Step 1: Check if the video exists
        const video = await this.videosService.findOneByWhereOptions({ ...options, id });
        // Step 2: Throw a NotFoundException if the video does not exist
        if (!video) {
            throw new common_1.NotFoundException(`Video with ID ${id} not found.`);
        }
        // Step 3: Delete the video entity from the database
        return this.videosService.delete(id, {
            where: options
        });
    }
};
exports.DeleteVideoHandler = DeleteVideoHandler;
exports.DeleteVideoHandler = DeleteVideoHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(delete_video_command_1.DeleteVideoCommand),
    tslib_1.__metadata("design:paramtypes", [videos_service_1.VideosService])
], DeleteVideoHandler);
//# sourceMappingURL=delete-video.handler.js.map