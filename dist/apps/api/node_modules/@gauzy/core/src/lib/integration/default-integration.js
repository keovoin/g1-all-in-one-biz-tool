"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_INTEGRATIONS = exports.PROJECT_MANAGE_DEFAULT_INTEGRATIONS = exports.DEFAULT_AI_INTEGRATIONS = exports.DEFAULT_SYSTEM_INTEGRATIONS = void 0;
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
/**
 *
 */
exports.DEFAULT_SYSTEM_INTEGRATIONS = [
    {
        name: contracts_1.IntegrationEnum.HUBSTAFF,
        imgSrc: 'hubstaff.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS],
        order: 1,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.HUBSTAFF),
        provider: contracts_1.IntegrationEnum.HUBSTAFF
    },
    {
        name: contracts_1.IntegrationEnum.UPWORK,
        imgSrc: 'upwork.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS],
        order: 2,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.UPWORK),
        provider: contracts_1.IntegrationEnum.UPWORK
    },
    {
        name: 'Import/Export',
        imgSrc: 'import-export.svg',
        isComingSoon: true,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.CRM],
        order: 6,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.IMPORT_EXPORT),
        provider: contracts_1.IntegrationEnum.IMPORT_EXPORT
    },
    {
        name: contracts_1.IntegrationEnum.MakeCom,
        imgSrc: 'make-com.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.AUTOMATION_TOOLS],
        order: 7,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.MakeCom),
        provider: contracts_1.IntegrationEnum.MakeCom
    },
    {
        name: contracts_1.IntegrationEnum.ZAPIER,
        imgSrc: 'zapier.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.AUTOMATION_TOOLS],
        order: 8,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.ZAPIER),
        provider: contracts_1.IntegrationEnum.ZAPIER
    },
    {
        name: contracts_1.IntegrationEnum.ACTIVE_PIECES,
        imgSrc: 'activepieces.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.AUTOMATION_TOOLS],
        order: 9,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.ACTIVE_PIECES),
        provider: contracts_1.IntegrationEnum.ACTIVE_PIECES
    }
];
/**
 *
 */
exports.DEFAULT_AI_INTEGRATIONS = [
    {
        name: 'Gauzy AI',
        imgSrc: 'gauzy-ai.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS],
        order: 3,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.GAUZY_AI),
        provider: contracts_1.IntegrationEnum.GAUZY_AI
    },
    {
        name: contracts_1.IntegrationEnum.SIM,
        imgSrc: 'sim.svg',
        isComingSoon: false,
        integrationTypesMap: [
            contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS,
            contracts_1.IntegrationTypeEnum.AI_AGENTS,
            contracts_1.IntegrationTypeEnum.AUTOMATION_TOOLS
        ],
        order: 10,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.SIM),
        provider: contracts_1.IntegrationEnum.SIM
    }
];
/**
 *
 */
exports.PROJECT_MANAGE_DEFAULT_INTEGRATIONS = [
    {
        name: contracts_1.IntegrationEnum.GITHUB,
        imgSrc: 'github.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.PROJECT_MANAGEMENT],
        order: 4,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.GITHUB),
        provider: contracts_1.IntegrationEnum.GITHUB
    },
    {
        name: contracts_1.IntegrationEnum.JIRA,
        imgSrc: 'jira.svg',
        isComingSoon: true,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.PROJECT_MANAGEMENT],
        order: 5,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.JIRA),
        provider: contracts_1.IntegrationEnum.JIRA
    },
    {
        name: contracts_1.IntegrationEnum.PLANE,
        imgSrc: 'plane.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.PROJECT_MANAGEMENT],
        order: 11,
        redirectUrl: (0, utils_1.sluggable)(contracts_1.IntegrationEnum.PLANE),
        provider: contracts_1.IntegrationEnum.PLANE
    },
    {
        name: contracts_1.IntegrationEnum.EVER_ASYNC,
        imgSrc: 'ever-async.svg',
        isComingSoon: false,
        integrationTypesMap: [contracts_1.IntegrationTypeEnum.ALL_INTEGRATIONS, contracts_1.IntegrationTypeEnum.PROJECT_MANAGEMENT],
        order: 12,
        redirectUrl: 'ever-async',
        provider: contracts_1.IntegrationEnum.EVER_ASYNC
    }
];
exports.DEFAULT_INTEGRATIONS = [
    ...exports.DEFAULT_SYSTEM_INTEGRATIONS,
    ...exports.DEFAULT_AI_INTEGRATIONS,
    ...exports.PROJECT_MANAGE_DEFAULT_INTEGRATIONS
];
//# sourceMappingURL=default-integration.js.map