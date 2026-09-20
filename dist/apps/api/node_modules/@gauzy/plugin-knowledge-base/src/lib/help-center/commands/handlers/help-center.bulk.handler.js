"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const help_center_service_1 = require("../../help-center.service");
const help_center_bulk_command_1 = require("../help-center.bulk.command");
let HelpCenterUpdateHandler = class HelpCenterUpdateHandler {
    constructor(helpCenterService) {
        this.helpCenterService = helpCenterService;
        this.diff = function (oldChildren, newChildren) {
            return oldChildren
                .filter((i) => !newChildren.includes(i))
                .concat(newChildren.filter((i) => !oldChildren.includes(i)));
        };
    }
    async execute(command) {
        const { oldChildren, newChildren } = command;
        const updateInput = await this.helpCenterService.getAllNodes();
        // Update indices for old children
        for (let i = 0; i < oldChildren.length; i++) {
            await Promise.all(updateInput.map(async (node) => {
                if (oldChildren[i].id === node.id) {
                    await this.helpCenterService.update(node.id, {
                        index: i
                    });
                }
            }));
        }
        const diffArray = this.diff(oldChildren, newChildren);
        // Update indices for new children if there are differences
        if (diffArray.length !== 0) {
            for (let i = 0; i < newChildren.length; i++) {
                await Promise.all(updateInput.map(async (node) => {
                    if (newChildren[i].id === node.id) {
                        await this.helpCenterService.update(node.id, {
                            index: i
                        });
                    }
                }));
            }
        }
        return await this.helpCenterService.updateBulk(updateInput);
    }
};
exports.HelpCenterUpdateHandler = HelpCenterUpdateHandler;
exports.HelpCenterUpdateHandler = HelpCenterUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(help_center_bulk_command_1.HelpCenterUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [help_center_service_1.HelpCenterService])
], HelpCenterUpdateHandler);
//# sourceMappingURL=help-center.bulk.handler.js.map