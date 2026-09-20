"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const tag_create_command_1 = require("./../tag-create.command");
const tag_service_1 = require("./../../tag.service");
let TagCreateHandler = class TagCreateHandler {
    constructor(_tagService) {
        this._tagService = _tagService;
    }
    /**
    * Execute the creation of a new tag based on the provided input data.
    *
    * @param command - The command object containing the tag creation input.
    * @returns A promise that resolves to the newly created tag.
    * @throws An error if the tag creation fails.
    */
    async execute(command) {
        const { input } = command;
        return await this.create(input);
    }
    /**
     * Create a new tag based on the provided input data.
     *
     * @param request - The input data for creating a new tag.
     * @returns A promise that resolves to the newly created tag.
     * @throws An error if the tag creation fails.
     */
    async create(request) {
        try {
            return await this._tagService.create(request);
        }
        catch (error) {
            console.log('Error while creating tag %s', error?.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.TagCreateHandler = TagCreateHandler;
exports.TagCreateHandler = TagCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tag_create_command_1.TagCreateCommand),
    tslib_1.__metadata("design:paramtypes", [tag_service_1.TagService])
], TagCreateHandler);
//# sourceMappingURL=tag-create.handler.js.map