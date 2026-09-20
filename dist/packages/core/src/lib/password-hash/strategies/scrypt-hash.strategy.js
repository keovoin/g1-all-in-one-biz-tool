"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScryptHashStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
let ScryptHashStrategy = class ScryptHashStrategy {
    constructor() {
        this.ALGORITHM_PREFIX = '$scrypt$';
    }
    async hash(password) {
        return (0, utils_1.hashPassword)(password);
    }
    async verify(password, hashedPassword) {
        return (0, utils_1.verifyPassword)(password, hashedPassword);
    }
    getAlgorithmIdentifier() {
        return 'scrypt';
    }
    canVerify(hashedPassword) {
        return hashedPassword?.startsWith(this.ALGORITHM_PREFIX) ?? false;
    }
};
exports.ScryptHashStrategy = ScryptHashStrategy;
exports.ScryptHashStrategy = ScryptHashStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ScryptHashStrategy);
//# sourceMappingURL=scrypt-hash.strategy.js.map