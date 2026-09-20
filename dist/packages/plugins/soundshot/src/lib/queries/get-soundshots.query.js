"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSoundshotsQuery = void 0;
class GetSoundshotsQuery {
    /**
     * Query to fetch paginated list of soundshots
     *
     * @description This query is used to retrieve a paginated list of soundshots with optional filtering and sorting
     * @param params - Pagination and filtering parameters for soundshots
     */
    constructor(params) {
        this.params = params;
    }
}
exports.GetSoundshotsQuery = GetSoundshotsQuery;
GetSoundshotsQuery.type = '[Soundshot] Get Many';
//# sourceMappingURL=get-soundshots.query.js.map