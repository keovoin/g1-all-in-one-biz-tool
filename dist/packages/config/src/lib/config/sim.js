"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
/**
 * Register SIM (Sim Studio) configuration using @nestjs/config
 */
exports.default = (0, config_1.registerAs)('sim', () => ({
    // SIM API Key (optional global fallback)
    apiKey: process.env.GAUZY_SIM_API_KEY ?? ''
}));
//# sourceMappingURL=sim.js.map