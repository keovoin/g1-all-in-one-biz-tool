"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVideoHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const videos_service_1 = require("../../services/videos.service");
const update_video_command_1 = require("../update-video.command");
let UpdateVideoHandler = class UpdateVideoHandler {
    constructor(videosService) {
        this.videosService = videosService;
    }
    /**
     * Handles the update of a video entity in the database.
     * This method receives an `UpdateVideoCommand`, updates the video entity with the provided data,
     * and returns the updated video entity.
     *
     * @param command - The command containing the input data for updating the video.
     *
     * @returns A promise that resolves to the updated video entity (`IVideo`).
     */
    async execute(command) {
        // Extract input data from the command
        const { input, id } = command;
        // Destructure the input fields for clarity
        const { title, description } = input;
        // Update the video entity in the database using the provided ID and input fields
        await this.videosService.update(id, {
            title,
            description
        });
        // Fetch and return the updated video entity by its ID
        return this.videosService.findOneByIdString(id);
    }
};
exports.UpdateVideoHandler = UpdateVideoHandler;
exports.UpdateVideoHandler = UpdateVideoHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_video_command_1.UpdateVideoCommand),
    tslib_1.__metadata("design:paramtypes", [videos_service_1.VideosService])
], UpdateVideoHandler);
//# sourceMappingURL=update-video.handler.js.map