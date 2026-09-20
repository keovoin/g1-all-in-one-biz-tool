"use strict";
// Copyright (c) 2019-2020 Ever Co. LTD
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const tslib_1 = require("tslib");
// Modified code from https://github.com/xmlking/ngx-starter-kit.
// Originally MIT Licensed
// - see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// - original code `Copyright (c) 2018 Sumanth Chinthagunta`;
const common_1 = require("@nestjs/common");
const path = require("path");
const config_1 = require("@gauzy/config");
const context_1 = require("./context");
const file_storage_1 = require("./file-storage");
const graphql_module_1 = require("../graphql/graphql.module");
const graphql_api_module_1 = require("../graphql/graphql-api.module");
const database_module_1 = require("../database/database.module");
let CoreModule = class CoreModule {
    /**
     * Configures middleware for the application.
     *
     * This method applies the specified middleware to the application using the
     * provided `MiddlewareConsumer`. In this case, the `RequestContextMiddleware`
     * is applied to all routes in the application.
     *
     * @param consumer - The `MiddlewareConsumer` provided by NestJS, used to manage
     * middleware configurations for the application.
     */
    configure(consumer) {
        consumer.apply(context_1.RequestContextMiddleware).forRoutes('*');
    }
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            graphql_api_module_1.GraphqlApiModule,
            graphql_module_1.GraphqlModule.registerAsync((configService) => ({
                path: configService.graphqlConfigOptions.path,
                playground: configService.graphqlConfigOptions.playground,
                debug: configService.graphqlConfigOptions.debug,
                cors: {
                    origin: '*',
                    credentials: true,
                    methods: [
                        'GET',
                        'HEAD',
                        'PUT',
                        'PATCH',
                        'POST',
                        'DELETE',
                        'OPTIONS'
                    ].join(','),
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
                typePaths: [
                    config_1.environment.isElectron
                        ? path.join(path.resolve(__dirname, '../../../../../../../data/'), '*.gql')
                        : path.join(path.resolve(__dirname, '../**/', 'schema'), '*.gql')
                ],
                resolverModule: graphql_api_module_1.GraphqlApiModule
            })),
            file_storage_1.FileStorageModule
        ],
        controllers: [],
        providers: []
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map