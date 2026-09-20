"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextCurrentUserProvider = exports.CURRENT_USER_PROVIDER = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("../core");
const create_token_1 = require("../token/shared/create-token");
exports.CURRENT_USER_PROVIDER = (0, create_token_1.createToken)('CurrentUserProviderToken');
let RequestContextCurrentUserProvider = class RequestContextCurrentUserProvider {
    getCurrentUserId() {
        return core_1.RequestContext.currentUserId();
    }
};
exports.RequestContextCurrentUserProvider = RequestContextCurrentUserProvider;
exports.RequestContextCurrentUserProvider = RequestContextCurrentUserProvider = tslib_1.__decorate([
    (0, common_1.Injectable)()
], RequestContextCurrentUserProvider);
//# sourceMappingURL=current-user.provider.js.map