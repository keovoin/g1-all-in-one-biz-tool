"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmGoalGeneralSettingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_general_setting_entity_1 = require("../goal-general-setting.entity");
let TypeOrmGoalGeneralSettingRepository = class TypeOrmGoalGeneralSettingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmGoalGeneralSettingRepository = TypeOrmGoalGeneralSettingRepository;
exports.TypeOrmGoalGeneralSettingRepository = TypeOrmGoalGeneralSettingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(goal_general_setting_entity_1.GoalGeneralSetting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmGoalGeneralSettingRepository);
//# sourceMappingURL=type-orm-goal-general-setting.repository.js.map