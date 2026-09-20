"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const guards_1 = require("../shared/guards");
const crud_1 = require("./../core/crud");
const mention_service_1 = require("./mention.service");
let MentionController = class MentionController extends crud_1.CrudController {
    constructor(mentionService) {
        super(mentionService);
        this.mentionService = mentionService;
    }
};
exports.MentionController = MentionController;
exports.MentionController = MentionController = tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/mentions'),
    tslib_1.__metadata("design:paramtypes", [mention_service_1.MentionService])
], MentionController);
//# sourceMappingURL=mention.controller.js.map