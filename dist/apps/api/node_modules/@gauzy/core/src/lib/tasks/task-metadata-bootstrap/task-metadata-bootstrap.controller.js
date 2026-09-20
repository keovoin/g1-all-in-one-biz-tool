"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataBootstrapController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../shared/guards");
const pipes_1 = require("../../shared/pipes");
const dto_1 = require("./dto");
const task_metadata_bootstrap_service_1 = require("./task-metadata-bootstrap.service");
let TaskMetadataBootstrapController = class TaskMetadataBootstrapController {
    constructor(service) {
        this.service = service;
    }
    bootstrap(query) {
        return this.service.bootstrap(query);
    }
};
exports.TaskMetadataBootstrapController = TaskMetadataBootstrapController;
tslib_1.__decorate([
    (0, common_1.Get)('/bootstrap'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true, transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.TaskMetadataBootstrapQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskMetadataBootstrapController.prototype, "bootstrap", null);
exports.TaskMetadataBootstrapController = TaskMetadataBootstrapController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Task Metadata'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/task-metadata'),
    tslib_1.__metadata("design:paramtypes", [task_metadata_bootstrap_service_1.TaskMetadataBootstrapService])
], TaskMetadataBootstrapController);
//# sourceMappingURL=task-metadata-bootstrap.controller.js.map