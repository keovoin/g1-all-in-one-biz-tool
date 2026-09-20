"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSoundshotCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const soundshot_entity_1 = require("../../entity/soundshot.entity");
const soundshot_service_1 = require("../../services/soundshot.service");
const soundshot_factory_1 = require("../../shared/soundshot.factory");
const create_soundshot_command_1 = require("../create-soundshot.command");
let CreateSoundshotCommandHandler = class CreateSoundshotCommandHandler {
    constructor(soundshotService) {
        this.soundshotService = soundshotService;
    }
    async execute(command) {
        // Extract the input and file from the command
        const { input, file } = command;
        // Prepare the file
        try {
            const { storageProvider } = await this.soundshotService.prepare(file);
            // Create the soundshot record
            const soundshot = Object.assign(new soundshot_entity_1.Soundshot(), soundshot_factory_1.SoundshotFactory.create(input), {
                fileKey: file.key,
                storageProvider
            });
            // Create the soundshot record
            return this.soundshotService.create(soundshot);
        }
        catch (error) {
            // Ensure cleanup of uploaded file if preparation failed
            if (file?.key) {
                const provider = this.soundshotService.getFileStorageProviderInstance();
                await provider.deleteFile(file.key);
            }
            throw error;
        }
    }
};
exports.CreateSoundshotCommandHandler = CreateSoundshotCommandHandler;
exports.CreateSoundshotCommandHandler = CreateSoundshotCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_soundshot_command_1.CreateSoundshotCommand),
    tslib_1.__metadata("design:paramtypes", [soundshot_service_1.SoundshotService])
], CreateSoundshotCommandHandler);
//# sourceMappingURL=create-soundshot-command.handler.js.map