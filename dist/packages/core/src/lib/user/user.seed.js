"use strict";
// Modified code from https://github.com/alexitaylor/angular-graphql-nestjs-postgres-starter-kit.
// MIT License, see https://github.com/alexitaylor/angular-graphql-nestjs-postgres-starter-kit/blob/master/LICENSE
// Copyright (c) 2019 Alexi Taylor
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomUsers = exports.createDefaultUsers = exports.createRandomSuperAdminUsers = exports.createDefaultEmployeesUsers = exports.createDefaultAdminUsers = void 0;
const faker_1 = require("@faker-js/faker");
const moment = require("moment");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const utils_2 = require("../core/seeds/utils");
const user_entity_1 = require("./user.entity");
const core_1 = require("../core");
const default_employees_1 = require("../employee/default-employees");
const default_candidates_1 = require("../candidate/default-candidates");
const default_users_1 = require("./default-users");
const user_avatar_1 = require("./user-avatar");
const user_avatar_seed_1 = require("./user-avatar.seed");
const createDefaultAdminUsers = async (dataSource, tenant) => {
    // Super Admin Users
    const _defaultSuperAdminUsers = seedSuperAdminUsers(dataSource, tenant);
    // Admin Users
    const _defaultAdminUsers = seedAdminUsers(dataSource, tenant);
    const [defaultSuperAdminUsers, defaultAdminUsers] = await Promise.all([
        _defaultSuperAdminUsers,
        _defaultAdminUsers
    ]);
    await insertUsers(dataSource, [...defaultSuperAdminUsers, ...defaultAdminUsers]);
    return {
        defaultSuperAdminUsers,
        defaultAdminUsers
    };
};
exports.createDefaultAdminUsers = createDefaultAdminUsers;
const createDefaultEmployeesUsers = async (dataSource, tenant) => {
    // Employee Users
    const _defaultEmployeeUsers = seedDefaultEmployeeUsers(dataSource, tenant, default_employees_1.DEFAULT_EMPLOYEES);
    const [defaultEmployeeUsers] = await Promise.all([_defaultEmployeeUsers]);
    await insertUsers(dataSource, [...defaultEmployeeUsers]);
    return {
        defaultEmployeeUsers
    };
};
exports.createDefaultEmployeesUsers = createDefaultEmployeesUsers;
const createRandomSuperAdminUsers = async (dataSource, tenants, noOfSuperAdmins) => {
    const tenantSuperAdminsMap = new Map();
    const superAdmins = [];
    for await (const tenant of tenants) {
        const { id: tenantId } = tenant;
        const superAdminRole = await dataSource.manager.findOneBy(core_1.Role, {
            tenantId,
            name: contracts_1.RolesEnum.SUPER_ADMIN
        });
        const tenantSuperAdmins = [];
        // Generate random super admins
        for (let i = 0; i < noOfSuperAdmins; i++) {
            const superAdminUser = await generateRandomUser(superAdminRole, tenant);
            tenantSuperAdmins.push(superAdminUser);
            superAdmins.push(superAdminUser);
            console.log(superAdminUser);
        }
        tenantSuperAdminsMap.set(tenant, tenantSuperAdmins);
    }
    await insertUsers(dataSource, superAdmins);
    return tenantSuperAdminsMap;
};
exports.createRandomSuperAdminUsers = createRandomSuperAdminUsers;
const createDefaultUsers = async (dataSource, tenant) => {
    const _defaultEverEmployeeUsers = seedDefaultEmployeeUsers(dataSource, tenant, default_employees_1.DEFAULT_EVER_EMPLOYEES);
    const _defaultCandidateUsers = seedDefaultCandidateUsers(dataSource, tenant);
    const [defaultEverEmployeeUsers, defaultCandidateUsers] = await Promise.all([
        _defaultEverEmployeeUsers,
        _defaultCandidateUsers
    ]);
    await insertUsers(dataSource, [...defaultEverEmployeeUsers, ...defaultCandidateUsers]);
    return {
        defaultEverEmployeeUsers,
        defaultCandidateUsers
    };
};
exports.createDefaultUsers = createDefaultUsers;
const createRandomUsers = async (dataSource, tenants, adminPerOrganization, organizationsPerTenant, employeesPerOrganization, candidatesPerOrganization, managersPerOrganization, dataEntriesPerOrganization, viewersPerOrganization) => {
    const randomTenantUsers = new Map();
    for (const tenant of tenants) {
        const _adminUsers = seedRandomUsers(dataSource, contracts_1.RolesEnum.ADMIN, tenant, organizationsPerTenant * adminPerOrganization //Because we want to seed at least one admin per organization
        );
        const _employeeUsers = seedRandomUsers(dataSource, contracts_1.RolesEnum.EMPLOYEE, tenant, employeesPerOrganization * organizationsPerTenant);
        const _candidateUsers = seedRandomUsers(dataSource, contracts_1.RolesEnum.CANDIDATE, tenant, candidatesPerOrganization * organizationsPerTenant);
        const _managerUsers = seedRandomUsers(dataSource, contracts_1.RolesEnum.MANAGER, tenant, managersPerOrganization * organizationsPerTenant);
        const _dataEntryUsers = seedRandomUsers(dataSource, contracts_1.RolesEnum.DATA_ENTRY, tenant, dataEntriesPerOrganization * organizationsPerTenant);
        const _viewerUsers = seedRandomUsers(dataSource, contracts_1.RolesEnum.VIEWER, tenant, viewersPerOrganization * organizationsPerTenant);
        const [promiseAdminUsers, promiseEmployeeUsers, promiseCandidateUsers, promiseManagerUsers, promiseDataEntryUsers, promiseViewerUsers] = await Promise.all([
            _adminUsers,
            _employeeUsers,
            _candidateUsers,
            _managerUsers,
            _dataEntryUsers,
            _viewerUsers
        ]);
        const adminUsers = await insertUsers(dataSource, [...promiseAdminUsers]);
        const employeeUsers = await insertUsers(dataSource, [...promiseEmployeeUsers]);
        const candidateUsers = await insertUsers(dataSource, [...promiseCandidateUsers]);
        await insertUsers(dataSource, [...promiseManagerUsers, ...promiseDataEntryUsers, ...promiseViewerUsers]);
        randomTenantUsers.set(tenant, {
            adminUsers,
            employeeUsers,
            candidateUsers
        });
    }
    return randomTenantUsers;
};
exports.createRandomUsers = createRandomUsers;
const seedSuperAdminUsers = async (dataSource, tenant) => {
    const superAdmins = [];
    const { id: tenantId } = tenant;
    const superAdminRole = await dataSource.manager.findOneBy(core_1.Role, {
        tenantId,
        name: contracts_1.RolesEnum.SUPER_ADMIN
    });
    // Generate default super admins
    for (const superAdmin of default_users_1.DEFAULT_SUPER_ADMINS) {
        const superAdminUser = generateDefaultUser(dataSource, superAdmin, superAdminRole, tenant);
        superAdmins.push(superAdminUser);
    }
    return Promise.all(superAdmins);
};
const seedAdminUsers = async (dataSource, tenant) => {
    const admins = [];
    const { id: tenantId } = tenant;
    const adminRole = await dataSource.manager.findOneBy(core_1.Role, {
        tenantId,
        name: contracts_1.RolesEnum.ADMIN
    });
    // Generate default admins
    for (const admin of default_users_1.DEFAULT_ADMINS) {
        const adminUser = generateDefaultUser(dataSource, admin, adminRole, tenant);
        admins.push(adminUser);
    }
    return Promise.all(admins);
};
const seedDefaultEmployeeUsers = async (dataSource, tenant, employees) => {
    const { id: tenantId } = tenant;
    const employeeRole = await dataSource.manager.findOneBy(core_1.Role, {
        tenantId,
        name: contracts_1.RolesEnum.EMPLOYEE
    });
    const defaultUsers = [];
    // Generate default users
    for (const employee of employees) {
        const user = generateDefaultUser(dataSource, employee, employeeRole, tenant);
        defaultUsers.push(user);
    }
    return Promise.all(defaultUsers);
};
const seedRandomUsers = async (dataSource, roleEnum, tenant, maxUserCount) => {
    const { id: tenantId } = tenant;
    const role = await dataSource.manager.findOneBy(core_1.Role, {
        tenantId,
        name: roleEnum
    });
    const randomUsers = [];
    let user;
    // Generate 50 random users
    for (let i = 0; i < maxUserCount; i++) {
        user = generateRandomUser(role, tenant);
        randomUsers.push(user);
    }
    return Promise.all(randomUsers);
};
const seedDefaultCandidateUsers = async (dataSource, tenant) => {
    const { id: tenantId } = tenant;
    const candidateRole = await dataSource.manager.findOneBy(core_1.Role, {
        tenantId,
        name: contracts_1.RolesEnum.CANDIDATE
    });
    const defaultCandidates = default_candidates_1.DEFAULT_CANDIDATES;
    const defaultCandidateUsers = [];
    let user;
    // Generate default candidate users
    for (const candidate of defaultCandidates) {
        user = generateDefaultUser(dataSource, candidate, candidateRole, tenant);
        defaultCandidateUsers.push(user);
    }
    return Promise.all(defaultCandidateUsers);
};
const generateDefaultUser = async (dataSource, defaultUser, role, tenant) => {
    const { firstName, lastName, email, imageUrl, preferredLanguage, preferredComponentLayout = contracts_1.ComponentLayoutStyleEnum.TABLE } = defaultUser;
    // Check if force password overwrite is enabled via environment variable
    const forcePasswordOverwrite = process.env.FORCE_SEED_PASSWORD === 'true';
    // Check if the user already exists in the database
    const existingUser = await dataSource.manager.findOne(user_entity_1.User, {
        where: { email, tenant: { id: tenant.id } }
    });
    const user = existingUser ? existingUser : new user_entity_1.User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;
    user.tenant = tenant;
    // The seed references avatars as `assets/images/avatars/<file>`, which only resolves inside the
    // Angular app (it ships `<base href="/">` and serves those files itself). Written verbatim into
    // `imageUrl` it 404s for every other client. Store the avatar as a real ImageAsset instead — the
    // same path an uploaded avatar takes — so the URL is absolute and resolvable everywhere. If the
    // asset cannot be prepared, fall back to the dummy image rather than a path that cannot load.
    //
    // A user who already has an avatar keeps it: re-seeding must not overwrite one they uploaded, the
    // same way the password hash below is preserved. Existing users that only carry the old seeded
    // path have no ImageAsset yet, so they are still backfilled.
    if ((0, user_avatar_1.shouldSeedAvatar)(existingUser)) {
        const avatar = await (0, user_avatar_seed_1.createSeededUserAvatar)(dataSource, imageUrl, tenant);
        if (avatar) {
            user.image = avatar.image;
            user.imageUrl = avatar.url;
        }
        else {
            // Persist the value ONLY if it can resolve on its own. A seed-asset reference we could
            // not prepare, any other bare relative path, and an empty or whitespace-only value all
            // fail to load wherever they are rendered — which is the defect this whole change
            // exists to remove — so they fall back to the dummy image instead.
            const usable = (0, user_avatar_1.isSelfResolvingImageUrl)(imageUrl) ? imageUrl.trim() : undefined;
            user.imageUrl = usable || (0, core_1.getUserDummyImage)(user);
        }
    }
    user.preferredLanguage = preferredLanguage;
    user.preferredComponentLayout = preferredComponentLayout;
    user.emailVerifiedAt = user.emailVerifiedAt || new Date();
    user.lastLoginAt = user.lastLoginAt || getRandomDateWithinLast3Months();
    // Only set the password hash if:
    // 1. The user is new (no existing hash), or
    // 2. FORCE_SEED_PASSWORD=true is set explicitly
    if (!existingUser || !existingUser.hash) {
        user.hash = await (0, utils_1.hashPassword)(defaultUser.password);
    }
    else if (forcePasswordOverwrite) {
        const atIdx = email.indexOf('@');
        const masked = atIdx > 2 ? email.slice(0, 2) + '***' + email.slice(atIdx) : '***';
        console.warn(`⚠️  [Seed] FORCE_SEED_PASSWORD is enabled — overwriting password for existing user "${masked}".`);
        user.hash = await (0, utils_1.hashPassword)(defaultUser.password);
    }
    else {
        const atIdx = email.indexOf('@');
        const masked = atIdx > 2 ? email.slice(0, 2) + '***' + email.slice(atIdx) : '***';
        console.log(`ℹ️  [Seed] User "${masked}" already exists with a password — skipping password overwrite. ` +
            `Set FORCE_SEED_PASSWORD=true to override.`);
        // Keep the existing password hash — do NOT overwrite
    }
    return user;
};
const generateRandomUser = async (role, tenant) => {
    const firstName = faker_1.faker.person.firstName();
    const lastName = faker_1.faker.person.lastName();
    const username = faker_1.faker.internet.username({ firstName, lastName });
    const email = (0, utils_2.getEmailWithPostfix)(faker_1.faker.internet.exampleEmail({ firstName, lastName }));
    const avatar = faker_1.faker.image.avatar();
    const user = new user_entity_1.User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.role = role;
    user.imageUrl = avatar;
    user.tenant = tenant;
    user.preferredLanguage = getRandomLanguage();
    user.emailVerifiedAt = new Date();
    user.lastLoginAt = getRandomDateWithinLast3Months();
    user.hash = await (0, utils_1.hashPassword)('12345678');
    return user;
};
/**
 * Get a randomly selected language from the LanguagesEnum.
 * @returns {LanguagesEnum} A randomly selected language.
 */
function getRandomLanguage() {
    const languages = Object.values(contracts_1.LanguagesEnum);
    const index = Math.floor(Math.random() * languages.length);
    return languages[index];
}
/**
 * Get a random date within the last 3 months.
 */
function getRandomDateWithinLast3Months() {
    const now = moment();
    const threeMonthsAgo = moment().subtract(3, 'months');
    const randomDate = moment(threeMonthsAgo).add(Math.random() * now.diff(threeMonthsAgo), 'milliseconds');
    return randomDate.toDate();
}
const insertUsers = async (dataSource, users) => {
    return await dataSource.manager.save(users);
};
//# sourceMappingURL=user.seed.js.map