"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphqlModuleOptions = createGraphqlModuleOptions;
const apollo_1 = require("@nestjs/apollo");
const graphql_1 = require("graphql");
const path = require("path");
const plugin_1 = require("@gauzy/plugin");
const utils_1 = require("@gauzy/utils");
/**
 * Creates and configures the GraphQL module options for Apollo Server in a NestJS application.
 *
 * - Uses the `ApolloDriver` as the GraphQL driver.
 * - Dynamically loads type definitions (`typeDefs`) using the `typesLoader`.
 * - Configures playground and debug mode based on the provided options.
 * - Sets up CORS policies, including allowed methods and headers.
 * - Includes the specified resolver module.
 *
 * @param {ConfigService} configService - The NestJS configuration service for retrieving environment variables.
 * @param {GraphQLTypesLoader} typesLoader - A utility to dynamically load GraphQL type definitions.
 * @param {GraphQLApiConfigurationOptions} options - Configuration options for the GraphQL API.
 * @returns {Promise<GqlModuleOptions>} A promise that resolves to GraphQL module options.
 */
async function createGraphqlModuleOptions(configService, typesLoader, options) {
    return {
        driver: apollo_1.ApolloDriver,
        path: `/${options.path}`,
        typeDefs: await createTypeDefs(configService, options, typesLoader),
        playground: options.playground || false,
        debug: options.debug || false,
        cors: {
            origin: '*',
            credentials: true,
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'].join(','),
            allowedHeaders: [
                'Authorization',
                'Language',
                'Tenant-Id',
                'Organization-Id',
                'X-Requested-With',
                'X-Auth-Token',
                'X-HTTP-Method-Override',
                'Content-Type',
                'Content-Language',
                'Accept',
                'Accept-Language',
                'Observe'
            ].join(', ')
        },
        include: [options.resolverModule]
    };
}
/**
 * Generates and returns the GraphQL type definitions (typeDefs) by:
 * - Normalizing file paths for cross-platform compatibility.
 * - Merging type definitions from the provided paths.
 * - Building the initial GraphQL schema.
 * - Extending the schema with additional plugin extensions if available.
 * - Printing the final schema as a string.
 *
 * @param {ConfigService} configService - The NestJS configuration service for accessing environment variables and plugins.
 * @param {GraphQLApiConfigurationOptions} options - The configuration options for GraphQL API, including type paths.
 * @param {GraphQLTypesLoader} typesLoader - The utility responsible for loading and merging GraphQL type definitions.
 * @returns {Promise<string>} A promise resolving to the final GraphQL schema as a string.
 */
async function createTypeDefs(configService, options, typesLoader) {
    // Normalize type paths to ensure compatibility across different OS file systems
    const normalizedPaths = options.typePaths.map((p) => p.split(path.sep).join('/'));
    // Load and merge type definitions from the given paths
    const typeDefs = await typesLoader.mergeTypesByPaths(normalizedPaths);
    // Build the GraphQL schema from the merged type definitions
    let schema = (0, graphql_1.buildSchema)(typeDefs);
    // Extend the schema using plugin extensions (if available)
    (0, plugin_1.getPluginExtensions)(configService.plugins)
        .map((extension) => (typeof extension.schema === 'function' ? extension.schema() : extension.schema))
        .filter(utils_1.isNotEmpty)
        .forEach((documentNode) => (schema = (0, graphql_1.extendSchema)(schema, documentNode)));
    // Convert the final schema into a printable string format
    return (0, graphql_1.printSchema)(schema);
}
//# sourceMappingURL=graphql-helper.js.map