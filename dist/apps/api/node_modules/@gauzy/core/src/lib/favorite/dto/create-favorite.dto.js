"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFavoriteDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../core/dto");
const favorite_entity_1 = require("../favorite.entity");
/*
 * Make entity record as favorite
 */
class CreateFavoriteDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, favorite_entity_1.Favorite) {
}
exports.CreateFavoriteDTO = CreateFavoriteDTO;
//# sourceMappingURL=create-favorite.dto.js.map