import { GqlModuleOptions, GraphQLTypesLoader } from '@nestjs/graphql';
import { GraphQLApiConfigurationOptions } from '@gauzy/common';
import { ConfigService } from '@gauzy/config';
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
export declare function createGraphqlModuleOptions(configService: ConfigService, typesLoader: GraphQLTypesLoader, options: GraphQLApiConfigurationOptions): Promise<GqlModuleOptions>;
