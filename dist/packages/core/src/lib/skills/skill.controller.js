"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const skill_service_1 = require("./skill.service");
const guards_1 = require("./../shared/guards");
let SkillController = class SkillController extends crud_1.CrudController {
    constructor(skillService) {
        super(skillService);
        this.skillService = skillService;
    }
    async findByName(name) {
        return this.skillService.findOneByName(name);
    }
};
exports.SkillController = SkillController;
tslib_1.__decorate([
    (0, common_1.Get)('getByName/:name'),
    tslib_1.__param(0, (0, common_1.Param)('name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SkillController.prototype, "findByName", null);
exports.SkillController = SkillController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Skills'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/skills'),
    tslib_1.__metadata("design:paramtypes", [skill_service_1.SkillService])
], SkillController);
//# sourceMappingURL=skill.controller.js.map