"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateVideoHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const video_entity_1 = require("../../entities/video.entity");
const videos_service_1 = require("../../services/videos.service");
const create_video_command_1 = require("../create-video.command");
let CreateVideoHandler = class CreateVideoHandler {
    constructor(videosService) {
        this.videosService = videosService;
    }
    /**
     * Handles the `CreateVideoCommand` to create a new video entity in the database.
     *
     * @param command - The `CreateVideoCommand` containing the input data for the new video.
     *
     * @returns A promise resolving to the newly created video entity (`IVideo`).
     */
    async execute(command) {
        // Extract input data from the command
        const { input } = command;
        // Step 1: Create a new video entity with the provided input
        const video = new video_entity_1.Video({
            ...input,
            file: input.file.key // Extract the file key if a file object is provided
        });
        // Step 2: Save the new video entity to the database
        return this.videosService.create(video);
    }
};
exports.CreateVideoHandler = CreateVideoHandler;
exports.CreateVideoHandler = CreateVideoHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_video_command_1.CreateVideoCommand),
    tslib_1.__metadata("design:paramtypes", [videos_service_1.VideosService])
], CreateVideoHandler);
//# sourceMappingURL=create-video.handler.js.map