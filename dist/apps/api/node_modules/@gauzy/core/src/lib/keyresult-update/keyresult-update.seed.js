"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultKeyResultUpdates = void 0;
const keyresult_update_entity_1 = require("./keyresult-update.entity");
const faker_1 = require("@faker-js/faker");
const contracts_1 = require("@gauzy/contracts");
const moment = require("moment");
const goal_time_frame_entity_1 = require("../goal-time-frame/goal-time-frame.entity");
const createDefaultKeyResultUpdates = async (dataSource, tenant, organization, keyResults) => {
    const defaultKeyResultUpdates = [];
    const goalTimeFrames = await dataSource.manager.find(goal_time_frame_entity_1.GoalTimeFrame);
    if (!keyResults) {
        console.warn('Warning: keyResults not found, DefaultKeyResultUpdates will not be created');
        return;
    }
    for await (const keyResult of keyResults) {
        const { initialValue, targetValue } = keyResult;
        const numberOfUpdates = faker_1.faker.number.int({ min: 2, max: 10 });
        for (let i = 0; i < numberOfUpdates; i++) {
            const startDate = goalTimeFrames.find((element) => element.name === keyResult.goal.deadline).startDate;
            if (moment().isAfter(startDate)) {
                const keyResultUpdate = new keyresult_update_entity_1.KeyResultUpdate();
                keyResultUpdate.owner = keyResult.owner.id;
                keyResultUpdate.keyResultId = keyResult.id;
                keyResultUpdate.tenant = tenant;
                keyResultUpdate.organization = organization;
                keyResultUpdate.status = faker_1.faker.helpers.arrayElement(Object.values(contracts_1.KeyResultUpdateStatusEnum));
                let max, min = 0;
                if (initialValue > targetValue) {
                    max = initialValue;
                    min = targetValue;
                }
                else {
                    max = targetValue;
                    min = initialValue;
                }
                keyResultUpdate.update = faker_1.faker.number.int({ min, max });
                if (keyResult.type !== contracts_1.KeyResultTypeEnum.TRUE_OR_FALSE) {
                    const diff = keyResult.targetValue - keyResult.initialValue;
                    const updateDiff = keyResultUpdate.update - keyResult.initialValue;
                    keyResultUpdate.progress = Math.round((Math.abs(updateDiff) / Math.abs(diff)) * 100);
                }
                else {
                    keyResultUpdate.progress = keyResultUpdate.update == 1 ? 100 : 0;
                }
                defaultKeyResultUpdates.push(keyResultUpdate);
            }
        }
    }
    return await insertDefaultKeyResultUpdates(dataSource, defaultKeyResultUpdates);
};
exports.createDefaultKeyResultUpdates = createDefaultKeyResultUpdates;
const insertDefaultKeyResultUpdates = async (dataSource, defaultKeyResultUpdates) => {
    return await dataSource.manager.save(defaultKeyResultUpdates);
};
//# sourceMappingURL=keyresult-update.seed.js.map