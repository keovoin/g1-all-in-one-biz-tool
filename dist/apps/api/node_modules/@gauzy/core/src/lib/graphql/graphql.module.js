"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const config_1 = require("@gauzy/config");
const graphql_helper_1 = require("./graphql-helper");
let GraphqlModule = class GraphqlModule {
    /**
     * Register GraphQL module asynchronously.
     * @param optionsFactory Factory function to provide GraphQL configuration options.
     * @returns Dynamic module configuration.
     */
    static registerAsync(optionsFactory) {
        return graphql_1.GraphQLModule.forRootAsync({
            driver: apollo_1.ApolloDriver,
            useFactory: async (configService, typesLoader) => {
                return (0, graphql_helper_1.createGraphqlModuleOptions)(configService, typesLoader, optionsFactory(configService));
            },
            inject: [config_1.ConfigService, graphql_1.GraphQLTypesLoader],
            imports: []
        });
    }
};
exports.GraphqlModule = GraphqlModule;
exports.GraphqlModule = GraphqlModule = tslib_1.__decorate([
    (0, common_1.Module)({})
], GraphqlModule);
//# sourceMappingURL=graphql.module.js.map