"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_env_1 = require("./load-env");
// Load environment variables
console.log('Loading Environment Variables...');
(0, load_env_1.loadEnv)();
console.log('Environment Variables Loaded');
console.time('✔ Total API Startup Time');
// Import bootstrap
console.time('✔ Bootstrap Import Time');
const bootstrap_1 = require("./bootstrap");
console.timeEnd('✔ Bootstrap Import Time');
console.log('API Core Bootstrap Loaded');
// Import dev-config
console.time('✔ Dev Config Import Time');
const dev_config_1 = require("./dev-config");
console.timeEnd('✔ Dev Config Import Time');
console.log('API Core Dev Config Loaded');
(async () => {
    try {
        console.log('API Core Starting...');
        await (0, bootstrap_1.bootstrap)(dev_config_1.devConfig);
        console.log('API Core is running...');
    }
    catch (error) {
        console.error('Error during API Core startup:', error);
        process.exit(1); // Exit the process with a failure code
    }
    console.timeEnd('✔ Total API Startup Time');
})();
//# sourceMappingURL=main.js.map