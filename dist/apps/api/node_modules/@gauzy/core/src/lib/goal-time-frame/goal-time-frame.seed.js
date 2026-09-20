"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultTimeFrames = void 0;
const goal_time_frame_entity_1 = require("./goal-time-frame.entity");
const moment = require("moment");
const createDefaultTimeFrames = async (dataSource, tenant, organizations) => {
    const defaultTimeFrames = [];
    for (const organization of organizations) {
        // Annual time frame current year
        defaultTimeFrames.push({
            name: `Annual-${moment().year()}`,
            status: 'Active',
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate(),
            tenant: tenant,
            organization: organization
        });
        // will add all 4 Quarters of current year
        for (let i = 1; i <= 4; i++) {
            const start = moment().quarter(i).startOf('quarter').toDate();
            const end = moment().quarter(i).endOf('quarter').toDate();
            defaultTimeFrames.push({
                name: `Q${i}-${moment().year()}`,
                status: 'Active',
                startDate: start,
                endDate: end,
                tenant: tenant,
                organization: organization
            });
        }
    }
    await insertDefaultTimeFrames(dataSource, defaultTimeFrames);
    return defaultTimeFrames;
};
exports.createDefaultTimeFrames = createDefaultTimeFrames;
const insertDefaultTimeFrames = async (dataSource, defaultTimeFrames) => {
    await dataSource
        .createQueryBuilder()
        .insert()
        .into(goal_time_frame_entity_1.GoalTimeFrame)
        .values(defaultTimeFrames)
        .execute();
};
//# sourceMappingURL=goal-time-frame.seed.js.map