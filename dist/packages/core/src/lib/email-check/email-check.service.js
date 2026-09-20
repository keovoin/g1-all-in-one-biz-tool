"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCheckService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
let EmailCheckService = class EmailCheckService {
    constructor(userService) {
        this.userService = userService;
    }
    /**
     * Checks if an email exists in the database.
     *
     * @param email - The email address to check.
     * @returns `true` if the email exists, otherwise `false`.
     */
    async doesEmailExist(email) {
        const count = await this.userService.count({ where: { email } });
        return count > 0;
    }
};
exports.EmailCheckService = EmailCheckService;
exports.EmailCheckService = EmailCheckService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService])
], EmailCheckService);
//# sourceMappingURL=email-check.service.js.map