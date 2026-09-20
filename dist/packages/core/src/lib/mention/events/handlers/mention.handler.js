"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMentionEventHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const mention_event_1 = require("../mention.event");
const mention_service_1 = require("../../mention.service");
let CreateMentionEventHandler = class CreateMentionEventHandler {
    constructor(mentionService) {
        this.mentionService = mentionService;
    }
    /**
     * Handles the `CreateMentionEvent` by creating a new mention using the provided input.
     *
     * @param {CreateMentionEvent} event - The mention event containing the data required to create a mention.
     * @returns {Promise<IMention>} A promise that resolves to the newly created mention entry.
     *
     */
    async handle(event) {
        try {
            // Extract the input from the event.
            const { input } = event;
            return await this.mentionService.create(input);
        }
        catch (error) {
            console.log(`Error while creating mention: ${error.message}`, error);
            throw new common_1.BadRequestException('Error while creating mention', error);
        }
    }
};
exports.CreateMentionEventHandler = CreateMentionEventHandler;
exports.CreateMentionEventHandler = CreateMentionEventHandler = tslib_1.__decorate([
    (0, cqrs_1.EventsHandler)(mention_event_1.CreateMentionEvent),
    tslib_1.__metadata("design:paramtypes", [mention_service_1.MentionService])
], CreateMentionEventHandler);
//# sourceMappingURL=mention.handler.js.map