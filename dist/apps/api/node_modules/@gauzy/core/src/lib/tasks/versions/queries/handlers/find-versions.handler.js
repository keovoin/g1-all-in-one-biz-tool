"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindVersionsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const version_service_1 = require("../../version.service");
const find_versions_query_1 = require("../find-versions.query");
let FindVersionsHandler = class FindVersionsHandler {
    constructor(taskVersionService) {
        this.taskVersionService = taskVersionService;
    }
    /**
     *
     * @param query
     * @returns
     */
    async execute(query) {
        const { options } = query;
        return await this.taskVersionService.fetchAll(options);
    }
};
exports.FindVersionsHandler = FindVersionsHandler;
exports.FindVersionsHandler = FindVersionsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_versions_query_1.FindVersionsQuery),
    tslib_1.__metadata("design:paramtypes", [version_service_1.TaskVersionService])
], FindVersionsHandler);
//# sourceMappingURL=find-versions.handler.js.map