"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSoundshotDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const soundshot_entity_1 = require("../entity/soundshot.entity");
class CreateSoundshotDTO extends (0, swagger_1.OmitType)(soundshot_entity_1.Soundshot, [
    'id',
    'fileKey',
    'createdAt',
    'updatedAt',
    'deletedAt'
]) {
}
exports.CreateSoundshotDTO = CreateSoundshotDTO;
//# sourceMappingURL=create-soundshot.dto.js.map