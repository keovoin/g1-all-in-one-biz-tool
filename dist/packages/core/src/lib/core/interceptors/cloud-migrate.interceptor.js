"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudMigrateInterceptor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let CloudMigrateInterceptor = class CloudMigrateInterceptor {
    intercept(ctx, next) {
        return next
            .handle()
            .pipe((0, operators_1.map)((response) => {
            if (response && response.data) {
                return response.data;
            }
            return response;
        }), (0, operators_1.catchError)((error) => (0, rxjs_1.of)(new common_1.HttpException(error.message, 404))));
    }
};
exports.CloudMigrateInterceptor = CloudMigrateInterceptor;
exports.CloudMigrateInterceptor = CloudMigrateInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CloudMigrateInterceptor);
//# sourceMappingURL=cloud-migrate.interceptor.js.map