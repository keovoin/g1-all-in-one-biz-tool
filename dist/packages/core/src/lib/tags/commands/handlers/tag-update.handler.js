"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const tag_update_command_1 = require("./../tag-update.command");
const tag_service_1 = require("./../../tag.service");
let TagUpdateHandler = class TagUpdateHandler {
    constructor(_tagService) {
        this._tagService = _tagService;
    }
    /**
     * Execute the update of an existing tag based on the provided ID and input data.
     *
     * @param command - The command object containing the tag ID and update input.
     * @returns A promise that resolves to the updated tag.
     * @throws An error if the tag update fails.
     */
    async execute(command) {
        const { id, input } = command;
        return await this.update(id, input);
    }
    /**
     * Update an existing tag with the specified ID and provided update data.
     *
     * @param id - The ID of the tag to update.
     * @param request - The update data for the tag.
     * @returns A promise that resolves to the updated tag.
     * @throws An error if the tag update fails.
     */
    async update(id, request) {
        try {
            await this._tagService.findOneByIdString(id);
            return await this._tagService.create({
                ...request,
                id
            });
        }
        catch (error) {
            console.log('Error while updating tag %s', error?.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TagUpdateHandler = TagUpdateHandler;
exports.TagUpdateHandler = TagUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tag_update_command_1.TagUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [tag_service_1.TagService])
], TagUpdateHandler);
//# sourceMappingURL=tag-update.handler.js.map