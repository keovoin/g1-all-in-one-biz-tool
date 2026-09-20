"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogBodyTransformPipe = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const context_1 = require("./../../../core/context");
let TimeLogBodyTransformPipe = class TimeLogBodyTransformPipe {
    transform(entity, metadata) {
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            const user = context_1.RequestContext.currentUser();
            entity.employeeId = user.employeeId;
        }
        return entity;
    }
};
exports.TimeLogBodyTransformPipe = TimeLogBodyTransformPipe;
exports.TimeLogBodyTransformPipe = TimeLogBodyTransformPipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TimeLogBodyTransformPipe);
//# sourceMappingURL=time-log-body-tranform.pipe.js.map