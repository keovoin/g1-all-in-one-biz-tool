"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_GOAL_TEMPLATES = void 0;
const contracts_1 = require("@gauzy/contracts");
exports.DEFAULT_GOAL_TEMPLATES = [
    {
        name: 'Improve product performance',
        level: 'Organization',
        category: contracts_1.GoalTemplateCategoriesEnum.PRODUCT_MANAGEMENT
    },
    {
        name: 'Successfully launch version 2 of our main product',
        level: 'Organization',
        category: contracts_1.GoalTemplateCategoriesEnum.MARKETING
    },
    {
        name: 'Redesign and launch our new landing page',
        level: 'Team',
        category: contracts_1.GoalTemplateCategoriesEnum.PRODUCT_MANAGEMENT
    },
    {
        name: 'Increase quality of releases and make sure they are timely',
        level: 'Team',
        category: contracts_1.GoalTemplateCategoriesEnum.PRODUCT_MANAGEMENT
    },
    {
        name: 'Identify problems with current user interface',
        level: 'Employee',
        category: contracts_1.GoalTemplateCategoriesEnum.PRODUCT_MANAGEMENT
    }
];
//# sourceMappingURL=default-goal-templates.js.map