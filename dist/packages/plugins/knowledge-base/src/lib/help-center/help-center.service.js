"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const core_1 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const type_orm_help_center_repository_1 = require("./repository/type-orm-help-center.repository");
const mikro_orm_help_center_repository_1 = require("./repository/mikro-orm-help-center.repository");
let HelpCenterService = class HelpCenterService extends core_1.TenantAwareCrudService {
    constructor(typeOrmHelpCenterRepository, mikroOrmHelpCenterRepository) {
        super(typeOrmHelpCenterRepository, mikroOrmHelpCenterRepository);
    }
    async updateBulk(updateInput) {
        return await this.saveMany(updateInput);
    }
    async deleteBulkByBaseId(ids) {
        if ((0, utils_1.isNotEmpty)(ids)) {
            /**
             * TypeORM typing limitations: cast via unknown to FindOptionsWhere.
             * TenantAwareCrudService.delete() enforces tenant scoping so tenant safety is preserved.
             */
            return [await this.delete({ id: (0, typeorm_1.In)(ids) })];
        }
        return [];
    }
    async getCategoriesByBaseId(baseId) {
        return await this.find({
            where: { parentId: baseId }
        });
    }
    async getAllNodes() {
        return await this.find({});
    }
};
exports.HelpCenterService = HelpCenterService;
exports.HelpCenterService = HelpCenterService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_help_center_repository_1.TypeOrmHelpCenterRepository,
        mikro_orm_help_center_repository_1.MikroOrmHelpCenterRepository])
], HelpCenterService);
//# sourceMappingURL=help-center.service.js.map