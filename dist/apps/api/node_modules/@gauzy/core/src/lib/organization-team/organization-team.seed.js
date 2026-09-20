"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDemoUsersLastTeam = exports.createRandomTeam = exports.createDefaultTeams = void 0;
const organization_team_entity_1 = require("./organization-team.entity");
const organization_team_employee_entity_1 = require("../organization-team-employee/organization-team-employee.entity");
const contracts_1 = require("@gauzy/contracts");
const _ = require("underscore");
const faker_1 = require("@faker-js/faker");
const config_1 = require("@gauzy/config");
const default_organization_teams_1 = require("./default-organization-teams");
const internal_1 = require("../core/entities/internal");
const createDefaultTeams = async (dataSource, organization, employees, roles) => {
    const teams = default_organization_teams_1.DEFAULT_ORGANIZATION_TEAMS;
    const { id: organizationId, tenantId } = organization;
    // Load employees with user.role relation to check for admin users
    const employeesWithRoles = await dataSource.manager.find(internal_1.Employee, {
        where: { organizationId, tenantId },
        relations: {
            user: {
                role: true
            }
        }
    });
    const organizationTeams = [];
    for (let i = 0; i < teams.length; i++) {
        const team = new organization_team_entity_1.OrganizationTeam();
        team.name = teams[i].name;
        team.organizationId = organizationId;
        team.tenant = organization.tenant;
        const managerEmails = teams[i].manager || [];
        const memberEmails = teams[i].defaultMembers || [];
        const managerRole = roles.find((x) => x.name === contracts_1.RolesEnum.MANAGER);
        // Create a map to track employees and their manager status
        const employeeMap = new Map();
        // First, add all members
        employeesWithRoles
            .filter((e) => memberEmails.indexOf(e.user.email) > -1)
            .forEach((emp) => {
            // Check if employee has ADMIN or SUPER_ADMIN role
            const isAdminUser = emp.user?.role?.name === contracts_1.RolesEnum.ADMIN || emp.user?.role?.name === contracts_1.RolesEnum.SUPER_ADMIN;
            // Admins should always be managers in their teams
            employeeMap.set(emp.id, { employee: emp, isManager: isAdminUser });
        });
        // Then, mark managers (this will update existing entries or add new ones)
        employeesWithRoles
            .filter((e) => managerEmails.indexOf(e.user.email) > -1)
            .forEach((emp) => {
            const existing = employeeMap.get(emp.id);
            if (existing) {
                // Employee is already a member, just mark as manager
                existing.isManager = true;
            }
            else {
                // Employee is only a manager, add them
                employeeMap.set(emp.id, { employee: emp, isManager: true });
            }
        });
        // Create team employee records from the map
        const teamEmployees = [];
        employeeMap.forEach(({ employee: emp, isManager }) => {
            const teamEmployee = new organization_team_employee_entity_1.OrganizationTeamEmployee();
            // Set IDs
            teamEmployee.employeeId = emp.id;
            teamEmployee.organizationId = organizationId;
            teamEmployee.tenantId = tenantId;
            // Set relations
            teamEmployee.employee = emp;
            teamEmployee.organizationTeam = team;
            // Set manager fields
            teamEmployee.isManager = isManager;
            teamEmployee.role = isManager ? managerRole : null;
            teamEmployees.push(teamEmployee);
        });
        team.members = teamEmployees;
        organizationTeams.push(team);
    }
    await insertOrganizationTeam(dataSource, organizationTeams);
    return organizationTeams;
};
exports.createDefaultTeams = createDefaultTeams;
const createRandomTeam = async (dataSource, tenants, roles, tenantOrganizationsMap, organizationEmployeesMap) => {
    const teamNames = ['QA', 'Designers', 'Developers', 'Employees'];
    const organizationTeams = [];
    for (const tenant of tenants) {
        const organizations = tenantOrganizationsMap.get(tenant);
        for (const organization of organizations) {
            const { id: tenantId } = tenant;
            const { id: organizationId } = organization;
            const employees = organizationEmployeesMap.get(organization);
            for (const name of teamNames) {
                const team = new organization_team_entity_1.OrganizationTeam();
                team.name = name;
                team.organizationId = organization.id;
                team.tenant = organization.tenant;
                team.members = [];
                /**
                 * Team Members
                 */
                const managers = _.chain(employees)
                    .shuffle()
                    .take(faker_1.faker.number.int({ min: 1, max: 5 }))
                    .values()
                    .value();
                managers.forEach((employee) => {
                    team.members.push(new organization_team_employee_entity_1.OrganizationTeamEmployee({
                        employeeId: employee.id,
                        tenantId,
                        organizationId,
                        isManager: true,
                        role: roles.find((role) => role.name === contracts_1.RolesEnum.MANAGER && role.tenantId === tenantId)
                    }));
                });
                organizationTeams.push(team);
            }
        }
    }
    const uniqueTeams = organizationTeams.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    });
    await insertOrganizationTeam(dataSource, uniqueTeams);
    return uniqueTeams;
};
exports.createRandomTeam = createRandomTeam;
const insertOrganizationTeam = async (dataSource, teams) => {
    await dataSource.manager.save(teams);
};
/**
 * Update lastTeamId for demo users after teams are created
 * This ensures demo users have a default team when they log in
 */
const updateDemoUsersLastTeam = async (dataSource, organization) => {
    const { id: organizationId, tenantId } = organization;
    // Get the demo user emails
    const demoEmails = [
        config_1.environment.demoCredentialConfig.superAdminEmail,
        config_1.environment.demoCredentialConfig.adminEmail,
        config_1.environment.demoCredentialConfig.employeeEmail
    ];
    // Find the users
    const users = await dataSource.manager.find(internal_1.User, {
        where: demoEmails.map((email) => ({ email, tenantId }))
    });
    if (users.length === 0) {
        console.warn('No demo users found to update lastTeamId');
        return;
    }
    // For each user, find their employee and first team
    for (const user of users) {
        // Find the employee for this user
        const employee = await dataSource.manager.findOne(internal_1.Employee, {
            where: {
                userId: user.id,
                tenantId,
                organizationId
            }
        });
        if (!employee) {
            console.warn(`No employee found for user ${user.email}`);
            continue;
        }
        // Find the first team this employee is a member of
        const teamMembership = await dataSource.manager.findOne(organization_team_employee_entity_1.OrganizationTeamEmployee, {
            where: {
                employeeId: employee.id,
                tenantId,
                organizationId
            },
            relations: {
                organizationTeam: true
            }
        });
        if (teamMembership && teamMembership.organizationTeam) {
            // Update the user's lastTeamId
            await dataSource.manager.update(internal_1.User, { id: user.id }, {
                lastTeamId: teamMembership.organizationTeam.id,
                defaultTeamId: teamMembership.organizationTeam.id
            });
            console.log(`Updated lastTeamId for ${user.email} to team: ${teamMembership.organizationTeam.name}`);
        }
    }
};
exports.updateDemoUsersLastTeam = updateDemoUsersLastTeam;
//# sourceMappingURL=organization-team.seed.js.map