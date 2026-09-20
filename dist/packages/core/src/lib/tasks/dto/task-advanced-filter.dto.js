"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAdvancedFilterDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TaskAdvancedFilterDTO {
    constructor() {
        this.ids = [];
        this.projects = [];
        this.teams = [];
        this.modules = [];
        this.sprints = [];
        this.members = [];
        this.tags = [];
        this.statusIds = [];
        this.priorityIds = [];
        this.sizeIds = [];
        this.parentIds = [];
        this.createdByUserIds = [];
    }
}
exports.TaskAdvancedFilterDTO = TaskAdvancedFilterDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "ids", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "teams", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "modules", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "sprints", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "members", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "statusIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "priorityIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "sizeIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "parentIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(25),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskAdvancedFilterDTO.prototype, "createdByUserIds", void 0);
//# sourceMappingURL=task-advanced-filter.dto.js.map