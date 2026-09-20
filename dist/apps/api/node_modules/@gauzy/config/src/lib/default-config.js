"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = void 0;
const dotenv = require("dotenv");
dotenv.config({ quiet: true });
const path = require("path");
const constants_1 = require("@gauzy/constants");
const database_1 = require("./database");
process.cwd();
let assetPath;
let assetPublicPath;
console.log('Default Config -> __dirname: ' + __dirname);
console.log('Default Config -> process.cwd: ' + process.cwd());
// TODO: maybe better to use process.cwd() instead of __dirname?
// For Docker environment
if (__dirname.startsWith('/srv/gauzy')) {
    // Set paths specific to Docker deployment
    assetPath = '/srv/gauzy/apps/api/src/assets';
    assetPublicPath = '/srv/gauzy/apps/api/public';
}
else {
    // Determine if running in production (dist) or development (src)
    const isDist = __dirname.includes(path.join('dist'));
    console.log('Default Config -> isDist: ' + isDist);
    // Adjust the base path based on the environment
    const basePath = isDist
        ? path.resolve(process.cwd(), 'dist/apps/api') // For production
        : path.resolve(__dirname, '../../../../apps/api'); // For development
    console.log('Default Config -> basePath: ' + basePath);
    // Set the asset paths relative to basePath
    assetPath = isDist
        ? path.join(basePath, 'assets') // In dist, assets are directly under 'assets'
        : path.join(basePath, 'src', 'assets'); // In dev, assets are under 'src/assets'
    // Default public directory for assets
    assetPublicPath = isDist
        ? path.resolve(process.cwd(), 'apps/api/public') // Adjusted for dist structure
        : path.resolve(__dirname, '../../../../apps/api/public');
}
console.log('Default Config -> assetPath: ' + assetPath);
console.log('Default Config -> assetPublicPath: ' + assetPublicPath);
/**
 * Application plugin default configuration
 */
exports.defaultConfiguration = {
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
        ...database_1.dbTypeOrmConnectionConfig
    },
    dbMikroOrmConnectionOptions: {
        ...database_1.dbMikroOrmConnectionConfig
    },
    dbKnexConnectionOptions: {
        retryAttempts: 5, // Number of retry attempts in case of connection failures
        retryDelay: 1000, // Delay between retry attempts in milliseconds
        ...database_1.dbKnexConnectionConfig
    },
    plugins: [],
    customFields: {
        Employee: [],
        Organization: [],
        OrganizationProject: [],
        Tag: [],
        Tenant: [],
        User: []
    },
    authOptions: {
        expressSessionSecret: process.env.EXPRESS_SESSION_SECRET || 'gauzy',
        userPasswordBcryptSaltRounds: 12,
        jwtSecret: process.env.JWT_SECRET || 'secretKey'
    },
    assetOptions: {
        assetPath: assetPath,
        assetPublicPath: assetPublicPath
    }
};
//# sourceMappingURL=default-config.js.map