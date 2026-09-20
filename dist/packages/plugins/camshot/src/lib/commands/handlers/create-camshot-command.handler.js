"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCamshotCommandHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const create_camshot_command_1 = require("../create-camshot.command");
const camshot_service_1 = require("../../services/camshot.service");
const camshot_entity_1 = require("../../entity/camshot.entity");
const camshot_factory_1 = require("../../shared/camshot.factory");
let CreateCamshotCommandHandler = class CreateCamshotCommandHandler {
    constructor(camshotService) {
        this.camshotService = camshotService;
    }
    async execute(command) {
        // Extract the input and file from the command
        const { input, file } = command;
        // Prepare the file
        const { thumbnail, storageProvider } = await this.camshotService.prepare(file);
        // Create the camshot record
        const camshot = Object.assign(new camshot_entity_1.Camshot(), camshot_factory_1.CamshotFactory.create(input), {
            fileKey: file.key,
            thumbKey: thumbnail.key,
            title: file.originalname,
            storageProvider,
            size: file.size,
        });
        // Create the camshot record
        return this.camshotService.create(camshot);
    }
};
exports.CreateCamshotCommandHandler = CreateCamshotCommandHandler;
exports.CreateCamshotCommandHandler = CreateCamshotCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(create_camshot_command_1.CreateCamshotCommand),
    tslib_1.__metadata("design:paramtypes", [camshot_service_1.CamshotService])
], CreateCamshotCommandHandler);
//# sourceMappingURL=create-camshot-command.handler.js.map