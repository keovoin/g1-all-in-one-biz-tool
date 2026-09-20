"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devConfig = void 0;
const constants_1 = require("@gauzy/constants");
const config_1 = require("@gauzy/config");
/**
 * Application plugin configuration for development environment.
 */
exports.devConfig = {
    apiConfigOptions: {
        host: process.env.API_HOST || constants_1.DEFAULT_API_HOST,
        port: process.env.API_PORT || constants_1.DEFAULT_API_PORT,
        baseUrl: process.env.API_BASE_URL || constants_1.DEFAULT_API_BASE_URL,
        middleware: [],
        graphqlConfigOptions: {
            path: constants_1.DEFAULT_GRAPHQL_API_PATH,
            playground: true,
            debug: true,
            apolloServerPlugins: []
        }
    },
    dbConnectionOptions: {
        // Reduce connection retries to avoid long startup hangs in dev/local runs
        retryAttempts: 5,
        retryDelay: 1000,
        migrationsTransactionMode: 'each', // Run migrations automatically in each transaction. i.e."all" | "none" | "each"
        migrationsRun: process.env.DB_SYNCHRONIZE === 'true' ? false : true, // Run migrations automatically if we don't do DB_SYNCHRONIZE
        ...config_1.dbTypeOrmConnectionConfig
    },
    dbMikroOrmConnectionOptions: {
        ...config_1.dbMikroOrmConnectionConfig
    },
    dbKnexConnectionOptions: {
        retryAttempts: 5,
        retryDelay: 1000,
        ...config_1.dbKnexConnectionConfig
    },
    plugins: []
};
//# sourceMappingURL=dev-config.js.map