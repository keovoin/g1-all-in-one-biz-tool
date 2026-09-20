"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCamshotQueryHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const get_camshot_query_1 = require("../get-camshot.query");
const camshot_service_1 = require("../../services/camshot.service");
let GetCamshotQueryHandler = class GetCamshotQueryHandler {
    constructor(camshotService) {
        this.camshotService = camshotService;
    }
    /**
     * Handles the `GetCamshotQuery` to retrieve a camshot entity by its ID.
     *
     * @param query - The `GetCamshotQuery` containing the ID of the camshot to be fetched and optional query options.
     *
     * @returns A promise resolving to the camshot entity (`ICamshot`) if found.
     *
     * @throws {NotFoundException} If the camshot with the specified ID is not found.
     */
    async execute(query) {
        // Destructure the query to extract the camshot ID and options
        const { id, options = {} } = query;
        // Step 1: Fetch the camshot entity from the database
        const camshot = await this.camshotService.findOneByIdString(id, options);
        // Step 2: Throw a NotFoundException if the camshot does not exist
        if (!camshot) {
            throw new common_1.NotFoundException(`Camshot with ID ${id} not found.`);
        }
        // Step 3: Return the camshot entity
        return camshot;
    }
};
exports.GetCamshotQueryHandler = GetCamshotQueryHandler;
exports.GetCamshotQueryHandler = GetCamshotQueryHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_camshot_query_1.GetCamshotQuery),
    tslib_1.__metadata("design:paramtypes", [camshot_service_1.CamshotService])
], GetCamshotQueryHandler);
//# sourceMappingURL=get-camshot-query.handler.js.map