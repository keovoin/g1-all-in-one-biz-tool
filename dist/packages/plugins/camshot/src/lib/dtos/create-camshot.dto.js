"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCamshotDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const camshot_entity_1 = require("../entity/camshot.entity");
class CreateCamshotDTO extends (0, swagger_1.OmitType)(camshot_entity_1.Camshot, ['id', 'fileKey', 'thumbKey', 'title', 'createdAt', 'updatedAt', 'deletedAt']) {
}
exports.CreateCamshotDTO = CreateCamshotDTO;
//# sourceMappingURL=create-camshot.dto.js.map