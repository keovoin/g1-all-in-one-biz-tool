"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlag = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@gauzy/constants");
const FeatureFlag = (feature) => (0, common_1.SetMetadata)(constants_1.FEATURE_METADATA, feature);
exports.FeatureFlag = FeatureFlag;
//# sourceMappingURL=feature-flag.decorator.js.map