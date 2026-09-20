"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInputDTO = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../user/dto");
class UserInputDTO extends dto_1.CreateUserDTO {
}
exports.UserInputDTO = UserInputDTO;
tslib_1.__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    tslib_1.__metadata("design:type", Object)
], UserInputDTO.prototype, "role", void 0);
//# sourceMappingURL=user-input-dto.js.map