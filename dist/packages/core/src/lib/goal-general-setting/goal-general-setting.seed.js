"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultGeneralGoalSetting = void 0;
const contracts_1 = require("@gauzy/contracts");
const goal_general_setting_entity_1 = require("./goal-general-setting.entity");
const createDefaultGeneralGoalSetting = async (dataSource, tenant, organizations) => {
    const defaultGeneralGoalSetting = [];
    for (const organization of organizations) {
        defaultGeneralGoalSetting.push({
            maxObjectives: 5,
            maxKeyResults: 5,
            employeeCanCreateObjective: true,
            canOwnObjectives: contracts_1.GoalOwnershipEnum.EMPLOYEES_AND_TEAMS,
            canOwnKeyResult: contracts_1.GoalOwnershipEnum.EMPLOYEES_AND_TEAMS,
            krTypeKPI: true,
            krTypeTask: true,
            organization: organization,
            tenant: tenant
        });
    }
    await insertDefaultGeneralGoalSetting(dataSource, defaultGeneralGoalSetting);
    return defaultGeneralGoalSetting;
};
exports.createDefaultGeneralGoalSetting = createDefaultGeneralGoalSetting;
const insertDefaultGeneralGoalSetting = async (dataSource, defaultGeneralGoalSetting) => {
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(goal_general_setting_entity_1.GoalGeneralSetting)
        .values(defaultGeneralGoalSetting)
        .execute();
};
//# sourceMappingURL=goal-general-setting.seed.js.map