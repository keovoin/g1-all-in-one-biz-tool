"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomOrganizationSprint = void 0;
const faker_1 = require("@faker-js/faker");
const organization_sprint_entity_1 = require("./organization-sprint.entity");
const contracts_1 = require("@gauzy/contracts");
const organization_project_entity_1 = require("../organization-project/organization-project.entity");
const moment = require("moment");
const task_entity_1 = require("../tasks/task.entity");
const createRandomOrganizationSprint = async (dataSource, tenants, tenantOrganizationsMap) => {
    if (!tenantOrganizationsMap) {
        console.warn('Warning: tenantOrganizationsMap not found, Random OrganizationSprint will not be created');
        return;
    }
    const sprints = [];
    for (const tenant of tenants) {
        const { id: tenantId } = tenant;
        const organizations = tenantOrganizationsMap.get(tenant);
        for (const organization of organizations) {
            const { id: organizationId } = organization;
            const projects = await dataSource.getRepository(organization_project_entity_1.OrganizationProject).findBy({
                tenantId,
                organizationId
            });
            let project = faker_1.faker.helpers.arrayElement(projects);
            const { id: projectId } = project;
            const tasks = await dataSource.getRepository(task_entity_1.Task).findBy({
                projectId
            });
            for (let i = 0; i <= faker_1.faker.number.int(10); i++) {
                const sprint = new organization_sprint_entity_1.OrganizationSprint();
                sprint.name = faker_1.faker.company.name();
                sprint.projectId = project.id;
                sprint.length = faker_1.faker.number.int({ min: 1, max: 9 });
                sprint.startDate = faker_1.faker.date.past();
                sprint.endDate = moment(sprint.startDate)
                    .add(1, 'months')
                    .toDate();
                sprint.isActive = faker_1.faker.datatype.boolean();
                sprint.dayStart = contracts_1.SprintStartDayEnum.MONDAY;
                sprint.organizationId = organizationId;
                sprint.tenantId = tenantId;
                sprint.tasks = tasks;
                sprints.push(sprint);
            }
        }
    }
    await dataSource.manager.save(sprints);
};
exports.createRandomOrganizationSprint = createRandomOrganizationSprint;
//# sourceMappingURL=organization-sprint.seed.js.map