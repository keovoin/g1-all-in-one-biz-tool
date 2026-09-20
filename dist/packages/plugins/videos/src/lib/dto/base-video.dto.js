"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseVideoDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const video_entity_1 = require("../entities/video.entity");
class BaseVideoDTO extends (0, swagger_1.OmitType)(video_entity_1.Video, ['id', 'file', 'createdAt', 'updatedAt', 'deletedAt']) {
}
exports.BaseVideoDTO = BaseVideoDTO;
//# sourceMappingURL=base-video.dto.js.map