"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlApiModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const role_entity_resolver_1 = require("./../role/role-entity.resolver");
const Resolvers = [role_entity_resolver_1.RoleEntityResolver];
let GraphqlApiModule = class GraphqlApiModule {
};
exports.GraphqlApiModule = GraphqlApiModule;
exports.GraphqlApiModule = GraphqlApiModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [...Resolvers],
        exports: [...Resolvers]
    })
], GraphqlApiModule);
//# sourceMappingURL=graphql-api.module.js.map