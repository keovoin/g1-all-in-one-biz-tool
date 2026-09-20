"use strict";
// db-operators.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIKE_OPERATOR = void 0;
const config_1 = require("@gauzy/config");
// Define the like operator based on the database type
exports.LIKE_OPERATOR = (0, config_1.isPostgres)() ? 'ILIKE' : 'LIKE';
//# sourceMappingURL=db-operators.js.map