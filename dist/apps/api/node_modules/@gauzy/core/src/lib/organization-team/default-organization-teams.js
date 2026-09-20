"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ORGANIZATION_TEAMS = void 0;
const config_1 = require("@gauzy/config");
exports.DEFAULT_ORGANIZATION_TEAMS = [
    {
        name: 'Employees',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.superAdminEmail}`,
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'ruslan@example-ever.co',
            'alish@example-ever.co',
            'julia@example-ever.co',
            'booster@example-ever.co',
            'yoster@example-ever.co'
        ],
        manager: [`${config_1.environment.demoCredentialConfig.superAdminEmail}`, 'ruslan@example-ever.co']
    },
    {
        name: 'Contractors',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            'ckhandla94@gmail.com',
            'hoster@example-ever.co',
            'aster@example-ever.co'
        ],
        manager: [`${config_1.environment.demoCredentialConfig.adminEmail}`, 'ruslan@example-ever.co']
    },
    {
        name: 'Designers',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'julia@example-ever.co',
            'roster@example-ever.co',
            'dister@example-ever.co',
            'postern@example-ever.co'
        ],
        manager: ['julia@example-ever.co', 'alish@example-ever.co', `${config_1.environment.demoCredentialConfig.employeeEmail}`]
    },
    {
        name: 'QA',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.superAdminEmail}`,
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'julia@example-ever.co',
            'kyoster@example-ever.co',
            'taster@example-ever.co',
            'mustero@smooper.xyz'
        ],
        manager: ['julia@example-ever.co']
    },
    {
        name: 'Developers',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'ruslan@example-ever.co',
            'alish@example-ever.co',
            'booster@example-ever.co',
            'yoster@example-ever.co',
            'ckhandla94@gmail.com',
            'rahulrathore576@gmail.com'
        ],
        manager: [`${config_1.environment.demoCredentialConfig.adminEmail}`, 'ruslan@example-ever.co', 'alish@example-ever.co']
    },
    {
        name: 'Marketing',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'julia@example-ever.co',
            'yostorono@example-ever.co',
            'desterrro@hotmail.com'
        ],
        manager: ['yostorono@example-ever.co', `${config_1.environment.demoCredentialConfig.employeeEmail}`]
    },
    {
        name: 'Default Team',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.superAdminEmail}`,
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            'ruslan@example-ever.co',
            'alish@example-ever.co',
            'julia@example-ever.co'
        ],
        manager: [
            `${config_1.environment.demoCredentialConfig.superAdminEmail}`,
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            `${config_1.environment.demoCredentialConfig.employeeEmail}`
        ]
    },
    {
        name: 'Backend Team',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            'ruslan@example-ever.co',
            'alish@example-ever.co',
            'ckhandla94@gmail.com',
            'rahulrathore576@gmail.com',
            'booster@example-ever.co',
            'hoster@example-ever.co'
        ],
        manager: ['ruslan@example-ever.co', `${config_1.environment.demoCredentialConfig.adminEmail}`]
    },
    {
        name: 'Frontend Team',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'alish@example-ever.co',
            'julia@example-ever.co',
            'yoster@example-ever.co',
            'roster@example-ever.co',
            'dister@example-ever.co'
        ],
        manager: ['alish@example-ever.co', `${config_1.environment.demoCredentialConfig.employeeEmail}`]
    },
    {
        name: 'Mobile Team',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.employeeEmail}`,
            'ruslan@example-ever.co',
            'booster@example-ever.co',
            'ckhandla94@gmail.com',
            'yoster@example-ever.co',
            'postern@example-ever.co'
        ],
        manager: ['ruslan@example-ever.co', `${config_1.environment.demoCredentialConfig.employeeEmail}`]
    },
    {
        name: 'DevOps Team',
        defaultMembers: [
            `${config_1.environment.demoCredentialConfig.superAdminEmail}`,
            `${config_1.environment.demoCredentialConfig.adminEmail}`,
            'ruslan@example-ever.co',
            'ckhandla94@gmail.com',
            'hoster@example-ever.co'
        ],
        manager: [`${config_1.environment.demoCredentialConfig.superAdminEmail}`, 'ruslan@example-ever.co']
    }
];
//# sourceMappingURL=default-organization-teams.js.map