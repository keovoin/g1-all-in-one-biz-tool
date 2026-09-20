"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ADMINS = exports.DEFAULT_SUPER_ADMINS = void 0;
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
exports.DEFAULT_SUPER_ADMINS = [
    {
        email: `${config_1.environment.demoCredentialConfig.superAdminEmail}`,
        password: `${config_1.environment.demoCredentialConfig.superAdminPassword}`,
        firstName: 'Super',
        lastName: 'Admin',
        imageUrl: 'assets/images/avatars/avatar-default.svg',
        preferredLanguage: contracts_1.LanguagesEnum.ENGLISH,
        preferredComponentLayout: contracts_1.ComponentLayoutStyleEnum.TABLE
    }
];
exports.DEFAULT_ADMINS = [
    {
        email: `${config_1.environment.demoCredentialConfig.adminEmail}`,
        password: `${config_1.environment.demoCredentialConfig.adminPassword}`,
        firstName: 'Local',
        lastName: 'Admin',
        imageUrl: 'assets/images/avatars/avatar-default.svg',
        preferredLanguage: contracts_1.LanguagesEnum.ENGLISH,
        preferredComponentLayout: contracts_1.ComponentLayoutStyleEnum.TABLE
    }
];
//# sourceMappingURL=default-users.js.map