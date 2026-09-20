"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = exports.FAVORITABLE_TYPE = exports.FAVORITE_SERVICE = void 0;
const common_1 = require("@nestjs/common");
exports.FAVORITE_SERVICE = 'FAVORITE_SERVICE';
exports.FAVORITABLE_TYPE = 'favoriteEntity';
const FavoriteService = (type) => (0, common_1.SetMetadata)(exports.FAVORITABLE_TYPE, type);
exports.FavoriteService = FavoriteService;
//# sourceMappingURL=is-favoritable.js.map