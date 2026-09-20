"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIM_MAX_TIMEOUT = exports.SIM_DEFAULT_TIMEOUT = exports.SIM_DEFAULT_BASE_URL = void 0;
/** SIM default base URL (can be overridden per tenant) */
exports.SIM_DEFAULT_BASE_URL = process.env['SIM_DEFAULT_BASE_URL'] || 'https://www.sim.ai';
/** Default workflow execution timeout (ms) */
exports.SIM_DEFAULT_TIMEOUT = 30000;
/** Maximum workflow execution timeout (ms) */
exports.SIM_MAX_TIMEOUT = 300000; // 5 minutes
//# sourceMappingURL=sim.config.js.map