"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register ActivePieces configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('activepieces', () => ({
    // Activepieces API Keys
    apiKey: process.env.GAUZY_ACTIVEPIECES_API_KEY ?? ''
}));
//# sourceMappingURL=activepieces.js.map