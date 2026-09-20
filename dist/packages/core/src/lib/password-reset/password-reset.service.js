"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_password_reset_repository_1 = require("./repository/type-orm-password-reset.repository");
const mikro_orm_password_reset_repository_1 = require("./repository/mikro-orm-password-reset.repository");
let PasswordResetService = class PasswordResetService extends crud_1.CrudService {
    constructor(typeOrmPasswordResetRepository, mikroOrmPasswordResetRepository) {
        super(typeOrmPasswordResetRepository, mikroOrmPasswordResetRepository);
    }
};
exports.PasswordResetService = PasswordResetService;
exports.PasswordResetService = PasswordResetService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_password_reset_repository_1.TypeOrmPasswordResetRepository,
        mikro_orm_password_reset_repository_1.MikroOrmPasswordResetRepository])
], PasswordResetService);
//# sourceMappingURL=password-reset.service.js.map