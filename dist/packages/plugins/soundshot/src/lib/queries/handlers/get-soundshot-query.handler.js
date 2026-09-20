"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSoundshotQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const get_soundshot_query_1 = require("../get-soundshot.query");
const soundshot_service_1 = require("../../services/soundshot.service");
let GetSoundshotQueryHandler = class GetSoundshotQueryHandler {
    constructor(soundshotService) {
        this.soundshotService = soundshotService;
    }
    /**
     * Handles the `GetSoundshotQuery` to retrieve a soundshot entity by its ID.
     *
     * @param query - The `GetSoundshotQuery` containing the ID of the soundshot to be fetched and optional query options.
     *
     * @returns A promise resolving to the soundshot entity (`ISoundshot`) if found.
     *
     * @throws {NotFoundException} If the soundshot with the specified ID is not found.
     */
    async execute(query) {
        // Destructure the query to extract the soundshot ID and options
        const { id, options = {} } = query;
        // Step 1: Fetch the soundshot entity from the database
        const soundshot = await this.soundshotService.findOneByIdString(id, options);
        // Step 2: Throw a NotFoundException if the soundshot does not exist
        if (!soundshot) {
            throw new common_1.NotFoundException(`Soundshot with ID ${id} not found.`);
        }
        // Step 3: Return the soundshot entity
        return soundshot;
    }
};
exports.GetSoundshotQueryHandler = GetSoundshotQueryHandler;
exports.GetSoundshotQueryHandler = GetSoundshotQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_soundshot_query_1.GetSoundshotQuery),
    tslib_1.__metadata("design:paramtypes", [soundshot_service_1.SoundshotService])
], GetSoundshotQueryHandler);
//# sourceMappingURL=get-soundshot-query.handler.js.map